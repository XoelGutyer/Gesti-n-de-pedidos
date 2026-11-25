<?php

namespace App\Http\Requests\Producto;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
       return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
       return [
    'nombre' => 'required|string|max:255',
    'precio' => 'required|numeric|gt:0',
    'costo' => 'required|numeric|gt:0',
    'stock' => 'required|integer|min:0',
    'imagen' => 'nullable|mimes:jpeg,png,jpg|max:2048',
    'proveedor_id' => 'required|exists:proveedores,id',
];
    }
}
