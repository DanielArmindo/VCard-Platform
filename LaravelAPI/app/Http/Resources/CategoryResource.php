<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public static $format = 'default';
    public function toArray(Request $request): array
    {
        switch (self::$format) {
            case 'withVCard':
                return [
                    'id' => $this->id,
                    'type' => $this->type,
                    'name' => $this->name,
                    'vcard' => $this->vcard,

                ];
            default:
                return [
                    'id' => $this->id,
                    'type' => $this->type,
                    'name' => $this->name,
                ];
        }
    }
}
