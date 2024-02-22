<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Category;

class UpdateTransactionRequest extends FormRequest
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
            'description' => ['nullable', 'string', 'max:255'],

            'category_id' => ['sometimes', 'nullable', 'integer', function ($attribute, $value, $fail) {
                $category = Category::find($value);
                if ($category && $category->type != $this->transaction->type) {
                    $fail("A categoria selecionada não é do tipo " . ($this->transaction->type == 'C' ? 'Crédito' : 'Débito'));
                }
            }]
        ];
    }
}
