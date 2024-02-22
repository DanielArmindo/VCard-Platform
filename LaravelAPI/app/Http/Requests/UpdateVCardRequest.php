<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Services\Base64Services;

class UpdateVCardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'base64ImagePhoto' => 'nullable|string',
            'deletePhotoOnTheServer' => 'nullable|boolean'
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $base64ImagePhoto = $this->base64ImagePhoto ?? null;
            if ($base64ImagePhoto) {
                $base64Service = new Base64Services();
                $mimeType = $base64Service->mimeType($base64ImagePhoto);
                if (!in_array($mimeType, ['image/png', 'image/jpg', 'image/jpeg'])) {
                    $validator->errors()->add('base64ImagePhoto', 'File type not supported (only supports "png" and "jpeg" images).');
                }
            }
        });
    }
}
