<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'date' => $this->date,
            'datetime' => $this->datetime,
            'type' => $this->type,
            'value' => $this->value,
            'old_balance' => $this->old_balance,
            'new_balance' => $this->new_balance,
            'payment_type' => $this->payment_type,
            'payment_reference' => $this->payment_reference,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'vcard' => $this->vcard,
        ];

        if ($this->payment_type == 'VCARD' && $this->pair_vcardRef) {
            $data['payment_name'] = $this->pair_vcardRef->name;
        }

        if ($this->payment_type == 'VCARD') {
            $data['sender_name'] = $this->vcardRef->name;
        }

        if (isset($this->category)) {
            $data['category_name'] = $this->category->name;
        }

        return $data;
    }
}
