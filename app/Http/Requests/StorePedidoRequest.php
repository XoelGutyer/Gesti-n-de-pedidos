<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Override;

class StorePedidoRequest extends FormRequest
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
            'cliente_id' => 'required|exists:clientes,id',
            'items' => 'required|array|min:1',
            'items.*.producto_id' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
        ];
    }

    #[Override]
    public function messages()
    {
        return [
            'cliente_id.required' => 'Debes seleccionar un cliente',
            'cliente_id.exists' => 'El cliente seleccionado no es valido',
            'items.required' => 'El pedido debe contener al menos un producto',
            'items.*.producto_id' => 'El producto seleccionado no es valido',
            'items.*.cantidad' => 'La cantidad debe ser al menos 1',            
        ];
    }
}
