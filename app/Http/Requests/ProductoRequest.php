<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductoRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre'=>'required|string|max:255',
            'precio'=>'required|numeric',
            'costo'=>'required|numeric',
            'stock'=>'required|integer',
            'imagen'=>'required|string|max:255',//'nullable|image|max:2048',
            'proveedor_id'=>'required|exists:proveedores,id'
        ];
    }
}
