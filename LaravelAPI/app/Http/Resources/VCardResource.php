<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VCardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'phone_number' => $this->phone_number,
            'name' => $this->name,
            'email' => $this->email,
            'balance' => $this->balance,
            'max_debit' => $this->max_debit,
            'photo_url' => $this->photo_url,
            'blocked' => $this->blocked,
        ];
    }
}
