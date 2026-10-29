<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'direccion' => ['required', 'string', 'max:255'],
            'celular' => ['required', 'string', 'max:255'],
            'password' => [
                'required',
                'confirmed',
                Password::defaults(),
            ],
        ]);

        // Crear el usuario y el cliente en una sola transacción.
        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['nombre'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'cliente',
            ]);

            Cliente::create([
                'nombre' => $data['nombre'],
                'direccion' => $data['direccion'],
                'email' => $data['email'],
                'dia' => 'lunes',
                'celular' => $data['celular'],
                'user_id' => $user->id,
            ]);

            return $user;
        });

        $token = $user->createToken('app-movil')->plainTextToken;

        //devuelve el usuario y un token ademas un mensaje
        return response()->json([
            'message' => 'Cuenta creada correctamente.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [
                    'Las credenciales ingresadas no son correctas.',
                ],
            ]);
        }

        $token = $user->createToken('app-movil')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }
}
