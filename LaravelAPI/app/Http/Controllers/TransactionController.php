<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreditTransactionRequest;
use App\Models\Vcard;
use App\Models\Transaction;
use App\Http\Resources\TransactionResource;
use App\Http\Requests\FilterTransactionsRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Support\Facades\Http;
use App\Http\Requests\TransactionRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TransactionController extends Controller
{

    public function show(Transaction $transaction)
    {
        return new TransactionResource($transaction);
    }

    // Get transactions of vcard
    public function getTransactionsOfVCard(FilterTransactionsRequest $request, Vcard $vcard)
    {
        $data = $request->validated();
        $transactions = $vcard->transactions();

        if (isset($data['type'])) $transactions = $transactions->where('type', '=', $data['type']);

        if (isset($data['start_date']) && isset($data['end_date'])) {
            $transactions = $transactions->whereBetween('date', [$data['start_date'], $data['end_date']]);
        } elseif (isset($data['start_date'])) {
            $transactions = $transactions->where('date', '>=', $data['start_date']);
        } elseif (isset($data['end_date'])) {
            $transactions = $transactions->where('date', '<=', $data['end_date']);
        }

        if (isset($data['payment_reference'])) $transactions = $transactions->where('payment_reference', 'like', '%' . $data['payment_reference'] . '%');

        $orderBy = [
            'DDESC' => ['datetime', 'DESC'],
            'DASC' => ['datetime', 'ASC'],
            'VDESC' => ['value', 'DESC'],
            'VASC' => ['value', 'ASC'],
        ];

        if (isset($data['sort']) && isset($orderBy[$data['sort']])) {
            $transactions = $transactions->orderBy(...$orderBy[$data['sort']]);
        }

        $transactions = $transactions->paginate(25);
        return TransactionResource::Collection($transactions);
    }


    // Display the last transaction of vcard
    public function getLastTransactionOfVCard(Vcard $vcard)
    {
        $transaction = Transaction::where('vcard', $vcard->phone_number)->orderBy('datetime', 'desc')->first();
        if ($transaction == null) {
            return response()->json(['message' => 'Não foi encontrada nenhuma transação'], 404);
        }
        return new TransactionResource($transaction);
    }


    // Debit
    public function debit(TransactionRequest $request)
    {
        $data = $request->validated();
        if (!password_verify($data['confirmation_code'], $request->user()->confirmation_code)) {
            return response()->json(['message' => 'Pin de confirmação errado!'], 401);
        }

        $vcard_debit = $request->user()->vcard;

        $custom_data = json_decode($vcard_debit->custom_data, true);
        $piggybank_balance = $custom_data['mealheiro']['balance'] ?? 0;

        $new_balance_debit = $vcard_debit->balance - $data['value'];
        if ($new_balance_debit - $piggybank_balance < 0) return response()->json(['message' => 'Sem saldo suficiente para efetuar a transação!'], 400);

        if ($data['value'] > $vcard_debit->max_debit) return response()->json(['message' => "Ultrapassou o valor máximo de débito"], 400);

        if ($data['payment_type'] == 'VCARD') {
            $vcard_credit = Vcard::find($data['payment_reference']);

            if ($vcard_credit == null) return response()->json(['message' => 'Vcard does not exist!'], 404);
            if ($vcard_credit->blocked) return response()->json(['message' => 'Não foi possível efetuar a transação!'], 400);
            if ($vcard_credit == $vcard_debit) return response()->json(['message' => 'Não pode fazer uma transação para si mesmo!'], 400);

            $new_balance_credit = $vcard_credit->balance + $data['value'];

            $transaction_credit = Transaction::create([
                'vcard' => $vcard_credit->phone_number,
                'type' => 'C',
                'date' => Carbon::now(),
                'datetime' => Carbon::now(),
                'value' => $data['value'],
                'old_balance' => $vcard_credit->balance,
                'new_balance' => $new_balance_credit,
                'payment_type' => $data['payment_type'],
                'payment_reference' => $vcard_debit->phone_number,
                'pair_vcard' => $vcard_debit->phone_number,
                'description' => $data['description'] ?? null,
            ]);
        } else {
            $request_external = new Request([
                'type' => $data['payment_type'], 'reference' => $data['payment_reference'], 'value' => $data['value'],
            ]);

            $response = Http::post('https://dad-202324-payments-api.vercel.app/api/credit', $request_external);
            if (!($response->successful())) {
                $errorDetails = $response->json();
                $errorMessage = $errorDetails['message'];
                $errorStatus = $errorDetails['status'];
                return response()->json(['message' => $errorStatus . ': ' . $errorMessage], 400);
            }
        }

        $transaction_debit = Transaction::create([
            'vcard' => $vcard_debit->phone_number,
            'type' => 'D',
            'date' => Carbon::now(),
            'datetime' => Carbon::now(),
            'value' => $data['value'],
            'old_balance' => $vcard_debit->balance,
            'new_balance' => $new_balance_debit,
            'payment_type' => $data['payment_type'],
            'payment_reference' => $data['payment_reference'],
            'pair_vcard' => isset($vcard_credit) ? $vcard_credit->phone_number : null,
            'category_id' => $data['category_id'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        // Funcionalidade Spare Change
        if ($custom_data['mealheiro']['spare_change'] ?? false) {
            $difference = ceil($data['value']) - $data['value'];
            if ($difference > 0 &&  !($data['value'] + $difference >= $vcard_debit->balance)) {
                $custom_data['mealheiro']['balance'] += $difference;
                $custom_data['mealheiro']['balance'] = number_format($custom_data['mealheiro']['balance'], 2, '.', '');
                $custom_data = json_encode($custom_data);
                $vcard_debit->update(['custom_data' => $custom_data]);
            }
        }

        if (isset($transaction_credit)) {
            $transaction_credit->update(['pair_transaction' => $transaction_debit->id]);
            $transaction_debit->update(['pair_transaction' => $transaction_credit->id]);
        }
        if (isset($vcard_credit) && isset($new_balance_credit)) $vcard_credit->update(['balance' => $new_balance_credit]);
        $vcard_debit->update(['balance' => $new_balance_debit]);

        return new TransactionResource($transaction_debit);
    }

    // Os admins irão simular que são parte de uma entidade externa para enviar dinheiro aos Vcards
    public function credit(CreditTransactionRequest $request)
    {
        $data = $request->validated();
        $vcard = Vcard::find($data['vcard']);
        if ($vcard == null) return response()->json(['message' => 'Vcard does not exist!'], 404);

        $body = [
            'type'      => $data['payment_type'],
            'reference' => $data['payment_reference'],
            'value'     => ceil(floatval($data['value']) * 100) / 100,
        ];

        $response = Http::post('https://dad-202324-payments-api.vercel.app/api/debit', $body);
        if (!($response->successful())) {
            $errorDetails = $response->json();
            $errorMessage = $errorDetails['message'];
            $errorStatus = $errorDetails['status'];
            return response()->json(['message' => $errorStatus . ': ' . $errorMessage], 400);
        }

        $new_balance = $vcard->balance + $data['value'];

        $transaction = Transaction::create([
            'vcard' => $vcard->phone_number,
            'type' => 'C',
            'date' => Carbon::now(),
            'datetime' => Carbon::now(),
            'value' => $data['value'],
            'old_balance' => $vcard->balance,
            'new_balance' => $new_balance,
            'payment_type' => $data['payment_type'],
            'payment_reference' => $data['payment_reference'],
            'description' => $data['description'] ?? null,
        ]);

        $vcard->update([
            'balance' => $new_balance,
        ]);

        return new TransactionResource($transaction);
    }

    public function partialUpdate(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $data = $request->validated();
        $transaction->fill($data);
        $transaction->save();
        return new TransactionResource($transaction);
    }
}
