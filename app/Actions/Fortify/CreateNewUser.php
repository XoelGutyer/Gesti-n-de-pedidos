<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'direccion' => ['required', 'string', 'max:255'],
            'celular' => ['required', 'string', 'max:30'],
            'dia' => ['required', Rule::in([
                'lunes', 'martes', 'miercoles', 'jueves',
                'viernes', 'sabado', 'domingo',
            ])],
        ])->validate();

        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);

            Cliente::create([
                'nombre' => $input['name'],
                'email' => $input['email'],
                'direccion' => $input['direccion'],
                'celular' => $input['celular'],
                'dia' => $input['dia'],
                'user_id' => $user->id,
            ]);

            return $user;
        });
    }
}