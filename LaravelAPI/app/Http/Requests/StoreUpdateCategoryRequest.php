<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateCategoryRequest extends FormRequest
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
            'type' => [
                'required',
                'string',
                'in:D,C',
                Rule::unique('categories')->where(function ($query) {
                    return $query->where('type', $this->type)
                        ->where('name', $this->name)
                        ->where('vcard', $this->vcard);
                }),
            ],
            'name' => ['required', 'string', 'max:50'],
            'vcard' => [
                'required',
                'exists:vcards,phone_number',
            ],
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function messages(): array
    {
        return [
            'type.unique' => 'The combination of type and name already exists for your list of categories.',
        ];
    }
}
