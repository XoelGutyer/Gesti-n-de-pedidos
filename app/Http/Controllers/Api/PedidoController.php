<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PedidoController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'fecha' => ['nullable', 'date'],
            'nota' => ['nullable', 'string', 'max:255'],
            'cliente_id' => ['nullable', 'exists:clientes,id'],
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.producto_id' => ['required', 'exists:productos,id'],
            'detalles.*.cantidad' => ['required', 'integer', 'min:1'],
            'detalles.*.descuento' => ['nullable', 'numeric', 'min:0'],
        ]);

        $user = $request->user();

        // El preventista elige el cliente; un cliente solo puede pedir para sí mismo
        $cliente = $user->hasRole('preventista')
            ? Cliente::find($data['cliente_id'] ?? null)
            : $user->cliente;

        if (! $cliente) {
            throw ValidationException::withMessages([
                'cliente_id' => 'No se pudo determinar el cliente del pedido.',
            ]);
        }

        $pedido = DB::transaction(function () use ($data, $user, $cliente) {
            $total = 0;
            $lineas = [];

            foreach ($data['detalles'] as $i => $d) {
                $producto = Producto::findOrFail($d['producto_id']);

                if ($producto->stock < $d['cantidad']) {
                    throw ValidationException::withMessages([
                        "detalles.$i.cantidad" => "Stock insuficiente de {$producto->nombre}.",
                    ]);
                }
                
                // El descuento sale del producto (porcentaje), no de lo que manda la app
                $descuento = min(max((float) $producto->descuento, 0), 100);
                $subtotal  = round($producto->precio * $d['cantidad'] * (1 - $descuento / 100), 2);
                $total    += $subtotal;
                
                $lineas[] = [
                    'producto_id'    => $producto->id,
                    'cantidad'       => $d['cantidad'],
                    'precioProducto' => $producto->precio,
                    'costoProducto'  => $producto->costo ?? 0,
                    'subtotal'       => $subtotal,
                ];
                
                $producto->decrement('stock', $d['cantidad']);
                
            }

            $pedido = Pedido::create([
                'fecha' => $data['fecha'] ?? now()->toDateString(),
                'nota' => $data['nota'] ?? '',
                'cliente' => $cliente->nombre,
                'direccion' => $cliente->direccion,
                'total' => $total,
                'usuario_id' => $user->id,
                'cliente_id' => $cliente->id,
            ]);

            foreach ($lineas as $linea) {
                DB::table('detalle_pedido')->insert($linea + [
                    'pedido_id' => $pedido->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return $pedido;
        });

        return response()->json([
            'data' => ['id' => $pedido->id, 'total' => $pedido->total],
        ], 201);
    }

    public function index(Request $request)
{
    $user = $request->user();

    $pedidos = Pedido::query()
        ->when(
            $user->hasRole('preventista'),
            // El preventista ve los pedidos que registró él
            fn ($q) => $q->where('usuario_id', $user->id),
            // El cliente ve los pedidos de su cliente, los haya cargado él o un preventista
            fn ($q) => $q->where('cliente_id', $user->cliente?->id ?? 0),
        )
        ->orderByDesc('fecha')
        ->orderByDesc('id')
        ->get(['id', 'fecha', 'nota', 'cliente', 'direccion', 'total', 'pagado']);

    return response()->json(['data' => $pedidos]);
}
}