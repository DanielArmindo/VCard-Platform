<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatisticAdminResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'ativos' => $this->resource['ativos'] ?? null,
            'blocked' => $this->resource['blocked'] ?? null,
            'sum_balance' => $this->resource['sum_balance'] ?? null,
            'avg_balance' => $this->resource['avg_balance'] ?? null,
            'payment_types' => $this->resource['payment_types'] ?? null,
            'transactions_per_month_and_year' => $this->resource['transactions_per_month_and_year'] ?? null,
            'monthly_financial_movements' => $this->resource['monthly_financial_movements'] ?? null,
            'vcards_balance_categories' => $this->resource['vcards_balance_categories'] ?? null,
            'registered_vcards_per_month_and_year' => $this->resource['registered_vcards_per_month_and_year'] ?? null,
        ];
    }
}
