<?php

namespace App\Http\Requests\Producto;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check(); // Solo permite la solicitud si el usuario está autenticado
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
            'precio' => 'required|numeric',
            'costo'  => 'required|numeric',
            'stock'  => 'required|integer',
            'imagen'=>'nullable|mimes:jpeg,png,jpg|max:2048',
            'proveedor_id'=> 'required|exists:proveedores,id'
        ];
    }
    
    public function attributes(): array
    {
        return [
            'nombre' => 'Nombre del producto',
            'precio' => 'Precio del producto',
            'costo'  => 'Costo del producto',
            'stock'  => 'Stock del producto',
            'imagen' => 'Imagen del producto',
            'proveedor_id'=> 'Proveedor'
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'precio.required' => 'El precio del producto es obligatorio.',
            'costo.required'  => 'El costo del producto es obligatorio.',
            'stock.required'  => 'El stock del producto es obligatorio.',
            'imagen.required' => 'La imagen del producto es obligatoria.',
            'proveedor_id.required'=> 'El proveedor es obligatorio.'
        ];
    }
}
