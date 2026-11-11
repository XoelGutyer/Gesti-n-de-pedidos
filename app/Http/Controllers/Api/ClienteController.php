<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Cliente;
use Illuminate\Http\JsonResponse;
use Intervention\Image\ImageManager;

class ClienteController extends Controller
{
    public function index(): JsonResponse
    {
        $clientes = Cliente::query()
            ->select([
                'id',
                'nombre',
                'direccion',
                'email',
                'dia',
                'celular',
                'user_id',
            ])
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'clientes' => $clientes,
        ]);
    }

    public function miCliente(Request $request)
{
    $cliente = $request->user()->cliente;

    if (! $cliente) {
        return response()->json(
            ['message' => 'El usuario no tiene un cliente asociado.'],
            404
        );
    }

    return response()->json(['data' => $cliente]);
}
}
