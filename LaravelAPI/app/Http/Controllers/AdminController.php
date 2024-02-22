<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Vcard;
use App\Http\Resources\AdminResource;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Http\Resources\StatisticAdminResource;
use App\Models\DefaultCategory;
use App\Models\Transaction;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Admin::class);
        return AdminResource::collection(Admin::all());
    }

    public function show(Admin $admin)
    {
        $this->authorize('view', $admin);
        return new AdminResource($admin);
    }

    public function update(UpdateAdminRequest $request, Admin $admin)
    {
        $this->authorize('update', $admin);
        $admin->update($request->validated());
        return new AdminResource($admin);
    }

    public function store(StoreAdminRequest $request)
    {
        $this->authorize('create', Admin::class);
        $newAdmin = Admin::create($request->validated());
        return new AdminResource($newAdmin);
    }

    public function destroy(Admin $admin)
    {
        $this->authorize('delete', $admin);
        $admin->delete();
        return new AdminResource($admin);
    }

    // Global Statistics for Admins
    public function getStatistics()
    {
        $data = [];

        //Nº de Ativos
        $value = Vcard::where('blocked', 0)->count();
        $data['ativos'] = $value;

        //Nº de Bloqueados
        $value = Vcard::where('blocked', 1)->count();
        $data['blocked'] = $value;

        //Soma do balance dos vcards ativos
        $value = Vcard::where('blocked', 0)->sum('balance');
        $data['sum_balance'] = $value;

        //Media do balance dos vcards ativos
        $value = Vcard::where('blocked', 0)->avg('balance');
        $data['avg_balance'] = round($value, 2);

        //Tipo de transações agrupadas pelos tipos de referencia
        $value = Transaction::selectRaw('payment_type as name, COUNT(*) as total')
            ->groupBy('payment_type')
            ->get();
        $data['payment_types'] = $value;

        //Nº de transações por mês e ano
        $transactionsPerMonthAndYearQuery = Transaction::selectRaw('COUNT(DISTINCT CASE WHEN pair_transaction IS NULL THEN id ELSE pair_transaction END) as count, YEAR(date) as year, MONTHNAME(date) as month_name')
            ->groupBy('year', 'month_name')
            ->orderBy('year')
            ->orderByRaw('FIELD(month_name, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")')
            ->get(['count', 'year', 'month_name']);

        $data['transactions_per_month_and_year'] = $transactionsPerMonthAndYearQuery;

        //Nº de registos de vcards por mês e ano
        $registeredVcardsPerMonthAndYearQuery = Vcard::selectRaw('COUNT(*) as count, YEAR(created_at) as year, MONTHNAME(created_at) as month_name')
            ->groupBy('year', 'month_name')
            ->orderBy('year')
            ->orderByRaw('FIELD(month_name, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")')
            ->get(['count', 'year', 'month_name']);

        $data['registered_vcards_per_month_and_year'] = $registeredVcardsPerMonthAndYearQuery;

        //Nº de movimentos financeiros mensais
        $monthlyFinancialMovements = Transaction::whereMonth('date', Carbon::now()->month)->whereYear('date', Carbon::now()->year)->sum('value');
        $data['monthly_financial_movements'] = $monthlyFinancialMovements;

        $vcards = Vcard::all();
        $vcardsBalanceCategories = ['0-500' => 0, '501-1000' => 0, '1001-1500' => 0, '1501-*' => 0];
        foreach ($vcards as $vcard) {
            if ($vcard->balance >= 0 && $vcard->balance <= 500) $vcardsBalanceCategories['0-500']++;
            elseif ($vcard->balance >= 501 && $vcard->balance <= 1000) $vcardsBalanceCategories['501-1000']++;
            elseif ($vcard->balance >= 1001 && $vcard->balance <= 1500) $vcardsBalanceCategories['1001-1500']++;
            elseif ($vcard->balance >= 1501) $vcardsBalanceCategories['1501-*']++;
        }
        $data['vcards_balance_categories'] = $vcardsBalanceCategories;

        return new StatisticAdminResource($data);
    }
}
