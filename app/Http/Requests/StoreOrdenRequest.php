<?php

namespace App\Http\Requests;

use App\Models\Producto;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreOrdenRequest extends FormRequest
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
            'proveedor_id' => 'required|exists:proveedores,id',
            'items' => 'required|array|min:1',

            'items.*.producto_id' => ['required',
                'distinct',
                'required',
                'exists:productos,id',
                function ($attribute, $valor, $fallos){
                    $producto = Producto::find($valor);
                    if($producto && $producto->proveedor_id != $this->proveedor_id){
                        $fallos('El producto seleccionado no pertenece al proveedor de esta orden');
                    }
                },
            ],
            'items.*.cantidad'        => 'required|integer|min:2',
            'items.*.costoProducto'   => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'proveedor_id.required' => 'Debes seleccionar un proveedor',
            'proveedor_id.exists' => 'El proveedor seleccionado no es valido',
            'items.required' => 'La orden debe contener al menos un producto',
            'items.*.producto_id' => 'El producto seleccionado no es valido',
            'items.*.producto_nombre' => 'El producto seleccionado no es valido',
            'items.*.cantidad' => 'La cantidad debe ser al menos 1',
            'items.*.costoProducto' => 'El costo del producto debe ser un número positivo',
        ];
    }
}
