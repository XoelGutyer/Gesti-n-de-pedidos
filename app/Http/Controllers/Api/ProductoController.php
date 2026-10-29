<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Intervention\Image\ImageManager;

class ProductoController extends Controller
{
    public function index(): JsonResponse
    {
        $productos = Producto::query()
            ->select([
                'id',
                'nombre',
                'precio',
                'stock',
                'imagen',
            ])
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'productos' => $productos,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $producto = Producto::find($id);

        if (! $producto) {
            return response()->json([
                'message' => 'Producto no encontrado.',
            ], 404);
        }

        return response()->json([
            'producto' => $producto,
        ]);
    }
}
