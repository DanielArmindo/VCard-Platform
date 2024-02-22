<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class DestroyVCardRequest extends FormRequest
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
        if ($this->user()->user_type !== 'A') {
            return [
                'password' => ['required', 'string', 'max:255', Password::min(3)],
                'confirmation_code' => 'required|regex:/^[0-9]{3}$/',
            ];
        }
        return [];
    }
}
