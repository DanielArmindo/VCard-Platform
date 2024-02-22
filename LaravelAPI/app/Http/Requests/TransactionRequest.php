<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class TransactionRequest extends FormRequest
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
            'confirmation_code' => ['required', 'string', 'size:3'],

            'payment_type' => ['required', 'string', 'in:VCARD,MBWAY,PAYPAL,IBAN,MB,VISA'],

            'payment_reference' => [
                'required',
                //Valida consoante o type
                function ($attribute, $value, $fail) {
                    $type = request()->input('payment_type');

                    if ($type == 'VCARD' && !preg_match('/^9\d{8}$/', $value)) {
                        $fail('O campo reference é inválido para o tipo VCARD.');
                    } elseif ($type == 'MBWAY' && !preg_match('/^9\d{8}$/', $value)) {
                        $fail('O campo reference é inválido para o tipo MBWAY.');
                    } elseif ($type == 'PAYPAL' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $fail('O campo reference deve ser um endereço de e-mail válido para o tipo PAYPAL.');
                    } elseif ($type == 'IBAN' && !preg_match('/^[A-Za-z]{2}\d{23}$/', $value)) {
                        $fail('O campo reference é inválido para o tipo IBAN.');
                    } elseif ($type == 'MB' && !preg_match('/^\d{5}-\d{9}$/', $value)) {
                        $fail('O campo reference é inválido para o tipo MB.');
                    } elseif ($type == 'VISA' && !preg_match('/^4\d{15}$/', $value)) {
                        $fail('O campo reference é inválido para o tipo VISA.');
                    }
                }
            ],

            'description' => ['nullable', 'string', 'max:255'],

            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],

            'value' => ['required', 'numeric', 'between:0.01,99999.99'],
        ];
    }
}
