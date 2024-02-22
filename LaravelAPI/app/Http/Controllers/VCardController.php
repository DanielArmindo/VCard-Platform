<?php

namespace App\Http\Controllers;

use App\Http\Requests\DestroyVCardRequest;
use App\Http\Requests\FilterVCardsRequest;
use App\Models\Vcard;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Resources\VCardResource;
use App\Http\Requests\StoreVCardRequest;
use App\Http\Requests\PartialUpdateVCardRequest;
use App\Http\Requests\UpdateVCardRequest;
use Illuminate\Validation\ValidationException;
use App\Services\Base64Services;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateVCardConfirmationCode;
use App\Http\Resources\StatisticVCardResource;
use Carbon\Carbon;


class VCardController extends Controller
{
    // Display a listing of the resource.
    public function index(FilterVCardsRequest $request)
    {
        $data = $request->validated();
        $query = Vcard::query();
        if (isset($data['phone_number'])) $query->where('phone_number', 'like', '%' . $data['phone_number'] . '%');
        if (isset($data['name'])) $query->where('name', 'like', '%' . $data['name'] . '%');
        if (isset($data['email'])) $query->where('email', 'like', '%' . $data['email'] . '%');
        if (isset($data['blocked'])) $query->where('blocked', $data['blocked']);

        if (isset($data['sort'])) {
            switch ($data['sort']) {
                case 'BDESC': // balance desc
                    $query->orderBy('balance', 'desc');
                    break;
                case 'BASC': // balance asc
                    $query->orderBy('balance', 'asc');
                    break;
                case 'MDESC': // max_debit desc
                    $query->orderBy('max_debit', 'desc');
                    break;
                case 'MASC': // max_debit asc
                    $query->orderBy('max_debit', 'asc');
                    break;
            }
        }
        return VCardResource::collection($query->paginate(25));
    }

    // Store a newly created resource in storage.
    public function store(StoreVCardRequest $request)
    {
        $data = $request->validated();

        $base64ImagePhoto = array_key_exists("base64ImagePhoto", $data) ?
            $data["base64ImagePhoto"] : ($data["base64ImagePhoto"] ?? null);
        unset($data["base64ImagePhoto"]);

        $vcard = new Vcard();
        $vcard->fill($data);
        if ($base64ImagePhoto) $vcard->photo_url = $this->storeBase64AsFile($vcard, $base64ImagePhoto);
        $vcard->save();
        return new VCardResource($vcard);
    }

    // Display the specified resource.
    public function show(Vcard $vcard)
    {
        return new VCardResource($vcard);
    }

    public function showName(Vcard $vcard)
    {
        if ($vcard) {
            return response()->json(['name' => $vcard->name], 200);
        }

        return response()->json(null, 404);
    }

    // Update the specified resource in storage.
    public function update(UpdateVCardRequest $request, Vcard $vcard)
    {
        $data = $request->validated();

        $base64ImagePhoto = array_key_exists("base64ImagePhoto", $data) ?
            $data["base64ImagePhoto"] : ($data["base64ImagePhoto"] ?? null);
        $deletePhotoOnTheServer = array_key_exists("deletePhotoOnTheServer", $data) && $data["deletePhotoOnTheServer"];
        unset($data["base64ImagePhoto"]);
        unset($data["deletePhotoOnTheServer"]);

        $vcard->fill($data);

        if ($vcard->photo_url && ($deletePhotoOnTheServer || $base64ImagePhoto)) {
            if (Storage::exists('public/fotos/' . $vcard->photo_url)) {
                Storage::delete('public/fotos/' . $vcard->photo_url);
            }
            $vcard->photo_url = null;
        }

        if ($base64ImagePhoto) $vcard->photo_url = $this->storeBase64AsFile($vcard, $base64ImagePhoto);
        $vcard->save();
        return new VCardResource($vcard);
    }

    // Atualiza apenas os campos blocked e max_debit, apenas o administrador pode usar este método.
    public function partialUpdate(PartialUpdateVCardRequest $request, Vcard $vcard)
    {
        $request->validated();
        $vcard->update($request->only(['blocked', 'max_debit']));
        if ($vcard->blocked) $vcard->tokens()->delete();
        return new VCardResource($vcard);
    }


    // Remove the specified resource from storage.
    public function destroy(Vcard $vcard, DestroyVCardRequest $request)
    {
        if ($vcard->balance != 0) {
            return response()->json(['message' => 'Não é possível eliminar um VCard com saldo diferente de 0.'], 400);
        }

        if ($request->user()->user_type != "A") {
            $data = $request->validated();

            if (!password_verify($data['confirmation_code'], $request->user()->confirmation_code) ||  !password_verify($data['password'], $request->user()->password)) {
                return response()->json(['message' => 'Password ou código de confirmação errado!'], 401);
            }
        }

        if ($vcard->transactions->count() == 0) {
            $vcard->categories()->forceDelete();
            $vcard->forceDelete();
            return new VCardResource($vcard);
        }

        $vcard->categories()->delete();
        $vcard->transactions()->delete();
        $vcard->delete();
        return new VCardResource($vcard);
    }

    // -- TAES -
    // Verify if a phone number or a set of phone numbers are associated with a VCards and return the associated phone numbers
    public function verifyPhoneNumbers(Request $request)
    {
        $request->validate([
            'phone_numbers' => ['required', 'string', 'regex:/^\d{9}(,\d{9})*$/'],
        ]);

        $phone_numbers = explode(',', $request->phone_numbers);
        $phone_numbers = array_map('trim', $phone_numbers);
        $phone_numbers = Vcard::whereIn('phone_number', $phone_numbers)->get()->pluck('phone_number')->toArray();
        return response()->json(['phone_numbers' => $phone_numbers], 200);
    }

    // Create JSON with piggy bank information including spare change
    private function createJSONPiggyBank(Vcard $vcard)
    {
        $custom_data = json_decode($vcard->custom_data, true);
        $custom_data['mealheiro'] = array('balance' => 0, 'spare_change' => false);
        $vcard->custom_data = json_encode($custom_data);
        $vcard->save();
        return $vcard->custom_data;
    }

    // Get JSON with piggy bank information
    public function getPiggyBank(Vcard $vcard)
    {
        $custom_data = json_decode($vcard->custom_data, true);
        if ($custom_data == null || !isset($custom_data['mealheiro']['balance']) || !isset($custom_data['mealheiro']['spare_change'])) {
            $custom_data = json_decode($this->createJSONPiggyBank($vcard), true);
        }
        return response()->json(['Mealheiro' => $custom_data['mealheiro']], 200);
    }


    // Activate or deactivate spare change
    public function patchPiggyBankSpareChange(Request $request, Vcard $vcard)
    {
        try {
            $data = $request->validate([
                'spare_change' => ['required', 'boolean']
            ]);
        } catch (ValidationException $e) {
            return response()->json(null, 422);
        }

        $custom_data = json_decode($vcard->custom_data, true);

        if ($custom_data == null || !isset($custom_data['mealheiro']['spare_change'])) {
            $custom_data = json_decode($this->createJSONPiggyBank($vcard), true);
        }

        $custom_data['mealheiro']['spare_change'] = $data['spare_change'];
        $vcard->custom_data = json_encode($custom_data);
        $vcard->save();

        $message = $data['spare_change'] ? 'Funcionalidade Spare Change Ativada!' : 'Funcionalidade Spare Change Desativada!';
        return response()->json(['message' => $message], 200);
    }

    // Debit piggy bank
    public function debitPiggyBank(Vcard $vcard, Request $request)
    {
        try {
            $request->validate([
                'value' => 'required|numeric|min:0.01',
            ]);
        } catch (ValidationException $e) {
            return response()->json(null, 422);
        }

        $custom_data = json_decode($vcard->custom_data, true);

        if ($custom_data == null || !isset($custom_data['mealheiro']['balance'])) {
            $custom_data = json_decode($this->createJSONPiggyBank($vcard), true);
        }

        if ($custom_data['mealheiro']['balance'] < $request['value']) {
            return response()->json(['message' => 'Saldo insuficiente no mealheiro. Não é possível retirar o valor especificado.'], 400);
        }

        $custom_data['mealheiro']['balance'] -= $request['value'];
        $vcard->custom_data = json_encode($custom_data);
        $vcard->save();

        return response()->json(['message' => 'Mealheiro Atualizado', 'savings' => $custom_data['mealheiro']['balance']], 200);
    }

    // Credit piggy bank
    public function creditPiggyBank(Vcard $vcard, Request $request)
    {
        try {
            $request->validate([
                'value' => 'required|numeric|min:0.01',
            ]);
        } catch (ValidationException $e) {
            return response()->json(null, 422);
        }

        $custom_data = json_decode($vcard->custom_data, true);

        if ($custom_data == null || !isset($custom_data['mealheiro']['balance'])) {
            $custom_data = json_decode($this->createJSONPiggyBank($vcard), true);
        }

        if ($vcard->balance < $request['value'] + $custom_data['mealheiro']['balance']) {
            return response()->json(['message' => 'Saldo insuficiente. Não é possível reforçar o mealheiro com o valor especificado.'], 400);
        }

        $custom_data['mealheiro']['balance'] += $request['value'];
        $vcard->custom_data = json_encode($custom_data);
        $vcard->save();

        return response()->json(['message' => 'Mealheiro Atualizado', 'savings' => $custom_data['mealheiro']['balance']], 200);
    }

    // Update confirmation code
    public function updateConfirmationCode(Vcard $vcard, UpdateVCardConfirmationCode $request)
    {
        $vcard->confirmation_code = $request->validated()['confirmation_code'];
        $vcard->save();
        return new VCardResource($vcard);
    }

    private function storeBase64AsFile(Vcard $vcard, String $base64String)
    {
        $targetDir = storage_path('app/public/fotos');
        $newfilename = $vcard->phone_number . "_" . rand(1000, 9999);
        $base64Service = new Base64Services();
        return $base64Service->saveFile($base64String, $targetDir, $newfilename);
    }

    public function getStatistics(Vcard $vcard)
    {
        // Money spent since ever by this vcard
        $MoneySpentSinceAllTime = $vcard->transactions()->where('type', 'D')->sum('value');

        // Money received since ever by this vcard
        $MoneyReceivedSinceAllTime = $vcard->transactions()->where('type', 'C')->sum('value');

        // Money spent this month and year by this vcard
        $MoneySpentThisMonth = $vcard->transactions()
            ->where('type', 'D')
            ->whereYear('date', Carbon::now()->year)
            ->whereMonth('date', Carbon::now()->month)
            ->sum('value');

        // Money received this month by this vcard
        $MoneyReceivedThisMonth = $vcard->transactions()
            ->where('type', 'C')
            ->whereYear('date', Carbon::now()->year)
            ->whereMonth('date', Carbon::now()->month)
            ->sum('value');

        // Money spent by category
        $moneySpentByCategory = $vcard->transactions()->where('type', 'D')->get()->groupBy('category_id')->map(function ($item) {
            return $item->sum('value');
        });
        // Change the keys of the array to the category name
        $moneySpentByCategory = $moneySpentByCategory->mapWithKeys(function ($value, $key) {
            $category = $key == null ? 'SemCategoria' : \App\Models\Category::find($key)->name;
            return [$category => $value];
        });

        // Just the top 10 categories
        $moneySpentByCategory = $moneySpentByCategory->sortDesc()->take(10);

        // Payments types and number of transactions (debit)
        $paymentTypesAndNumberOfTransactionsDebit = $vcard->transactions()->selectRaw('payment_type as name, COUNT(*) as total')
            ->where('type', 'D')
            ->groupBy('payment_type')
            ->orderBy('payment_type')
            ->get();

        // Payments types and number of transactions (credit)
        $paymentTypesAndNumberOfTransactionsCredit = $vcard->transactions()->selectRaw('payment_type as name, COUNT(*) as total')
            ->where('type', 'C')
            ->groupBy('payment_type')
            ->orderBy('payment_type')
            ->get();

        // Transactions per month and year
        $transactionsPerMonthAndYearQuery = Transaction::selectRaw('COUNT(DISTINCT CASE WHEN pair_transaction IS NULL THEN id ELSE pair_transaction END) as count, YEAR(date) as year, MONTHNAME(date) as month_name')
            ->where('vcard', $vcard->phone_number)
            ->groupBy('year', 'month_name')
            ->orderBy('year')
            ->orderByRaw('FIELD(month_name, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")')
            ->get(['count', 'year', 'month_name']);

        return new StatisticVCardResource([
            'money_spent_since_all_time' => $MoneySpentSinceAllTime,
            'money_received_since_all_time' => $MoneyReceivedSinceAllTime,
            'transactions_per_month_and_year' => $transactionsPerMonthAndYearQuery,
            'money_spent_by_category' => $moneySpentByCategory,
            'payment_types_debit' => $paymentTypesAndNumberOfTransactionsDebit,
            'payment_types_credit' => $paymentTypesAndNumberOfTransactionsCredit,
            'money_spent_this_month' => $MoneySpentThisMonth,
            'money_received_this_month' => $MoneyReceivedThisMonth,
        ]);
    }

    // -- TAES -- (Rota Extra)
    public function deleteVcard(Request $request, Vcard $vcard)
    {
        $data = $request->validate([
            'password' => ['required', 'string', 'max:255'],
            'confirmation_code' => ['required', 'regex:/^[0-9]{3}$/'],
        ]);

        if (!password_verify($data['confirmation_code'], $request->user()->confirmation_code) ||  !password_verify($data['password'], $request->user()->password)) {
            return response()->json(['message' => 'Password ou código de confirmação errado!'], 401);
        }

        if ($vcard->balance != 0) {
            return response()->json(['message' => 'Não é possível eliminar um VCard com saldo diferente de 0.'], 400);
        }

        $vcard->delete();

        return response()->json(['message' => 'A sua conta VCard foi eliminada com sucesso!'], 200);
    }
}
