<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateDefaultCategoryRequest extends FormRequest
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
        $categoryId = $this->route('default_category') ? $this->route('default_category')->id : null;

        return [
            'type' => ['required', 'string', 'in:D,C', 'unique:default_categories,type,' . $categoryId . ',id,name,' . $this->name],
            'name' => ['required', 'string', 'max:50'],
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
            'type.unique' => 'The combination of type and name already exists.',
        ];
    }
}
