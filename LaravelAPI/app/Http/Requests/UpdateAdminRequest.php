<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class UpdateAdminRequest extends FormRequest
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
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ];

        // Se a password está a ser atualizada, então é necessário a password atual para confirmação
        // if ($this->has('password')) {
        //     $rules['current_password'] = [
        //         'required',
        //         function ($attribute, $value, $fail) {
        //             if (!Hash::check($value, auth()->user()->password)) {
        //                 $fail('The current password is incorrect.');
        //             }
        //         },
        //     ];
        //     $rules['password'] = ['required', 'string', Password::min(3), 'max:255', 'confirmed'];
        // }
        return $rules;
    }
}
