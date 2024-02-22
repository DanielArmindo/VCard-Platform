<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use App\Services\Base64Services;

class StoreVCardRequest extends FormRequest
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
            'phone_number' => [
                'required',
                'string',
                'regex:/^9\d{8}$/',
                Rule::unique('vcards', 'phone_number')->ignore($this->route('vcard')), //Não permite que o número de telefone seja igual a outro que já esteja na base de dados
                // o ignore() é para ignorar o próprio número de telefone do vcard, em casos operações de update
            ],
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => ['required', 'string', 'max:255', Password::min(3)],
            'confirmation_code' => 'required|regex:/^[0-9]{3}$/', // Supostamente são 3 dígitos, como é dito na tabela mas o enunciado não é consistente.
            'base64ImagePhoto' => 'nullable|string',
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
