<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetPhoneNumbersAssociatedRequest extends FormRequest
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
            'phone_numbers' => 'required|array',
            'phone_numbers.*' => 'required|numeric|regex:/^\d{9}$/',
        ];
    }

    // show json error messages
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Validation\ValidationException($validator, response()->json($validator->errors(), 422));
    }
}
