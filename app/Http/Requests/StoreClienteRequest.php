<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreClienteRequest extends FormRequest
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
            'nombre'    => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'email'     => 'required|email|max:255',
            'dia'       => [
                'required',
                Rule::in(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']),
            ],
            'celular'   => 'required|string|max:30',
            'user_id'   => 'nullable|exists:users,id',

            'crear_usuario' => 'required|boolean',
            'name'=> 'required_if:crear_usuario,true|nullable|string|max:255',
            'contraseña'    => ['required_if:crear_usuario,true','nullable',Password::defaults()]
        ];
    }

        public function attributes(): array
    {
        return [
            'nombre'    => 'Nombre del cliente',
            'direccion' => 'Direccion del cliente',
            'email'     => 'Email del cliente',
            'dia'       => 'Dia del cliente',
            'celular'   => 'Celular del cliente',
            'user_id'   => 'Usuario',
            'name'      => 'Nombre de usuario del cliente'
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio',
            'dia.in' => 'El :attribute seleccionado no es valido',
            'name.required_if' => 'El nombre de usuario es obligatorio'
        ];
    }
}
