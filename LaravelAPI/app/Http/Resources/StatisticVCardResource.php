<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatisticVCardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'money_spent_since_all_time' => $this->resource['money_spent_since_all_time'] ?? null,
            'money_received_since_all_time' => $this->resource['money_received_since_all_time'] ?? null,
            'transactions_per_month_and_year' => $this->resource['transactions_per_month_and_year'] ?? null,
            'money_spent_by_category' => $this->resource['money_spent_by_category'] ?? null,
            'payment_types_debit' => $this->resource['payment_types_debit'] ?? null,
            'payment_types_credit' => $this->resource['payment_types_credit'] ?? null,
            'money_spent_this_month' => $this->resource['money_spent_this_month'] ?? null,
            'money_received_this_month' => $this->resource['money_received_this_month'] ?? null,
        ];
    }
}
