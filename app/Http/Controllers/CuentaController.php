<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pedido;
use Illuminate\Validation\Rule;

class CuentaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // El admin tiene su propio panel
        if ($user->hasRole('admin')) {
            return redirect('/dashboard');
        }

        $cliente = $user->cliente;

        $filtros = $request->validate([
    'desde' => ['nullable', 'date'],
    'hasta' => ['nullable', 'date'],
]);

$pedidos = $cliente
    ? $cliente->pedidos()
        ->when($filtros['desde'] ?? null, fn ($q, $d) => $q->whereDate('fecha', '>=', $d))
        ->when($filtros['hasta'] ?? null, fn ($q, $h) => $q->whereDate('fecha', '<=', $h))
        ->orderByDesc('fecha')
        ->orderByDesc('id')
        ->get(['id', 'fecha', 'total', 'pagado', 'nota'])
    : [];

return Inertia::render('TiendaOnline/mi-cuenta', [
    'cliente' => $cliente?->only('nombre', 'email', 'direccion', 'celular', 'dia'),
    'pedidos' => $pedidos,
    'filtros' => [
        'desde' => $filtros['desde'] ?? '',
        'hasta' => $filtros['hasta'] ?? '',
    ],
]);
    }

    public function pedido(Request $request, Pedido $pedido)
{
    $cliente = $request->user()->cliente; // AJUSTAR: relación User -> Cliente

    // Seguridad: un cliente solo puede ver SUS pedidos
    abort_unless($cliente && $pedido->cliente_id === $cliente->id, 404);

    $pedido->load('items.producto'); // AJUSTAR: nombres de relaciones

    return Inertia::render('TiendaOnline/mi-cuenta-pedidos', [
        'pedido' => [
            'id'     => $pedido->id,
            'fecha'  => $pedido->fecha,
            'total'  => $pedido->total,
            'pagado' => (bool) $pedido->pagado,
            'nota'   => $pedido->nota,
            'items'  => $pedido->items->map(fn ($d) => [
                'id'              => $d->id,
                'producto'        => $d->producto->nombre ?? 'Producto eliminado', // AJUSTAR
                'cantidad'        => $d->cantidad,
                'precio_unitario' => $d->precioProducto,
                'descuento'       => (int) $d->descuento,                          // AJUSTAR
                'subtotal'        => $d->cantidad * $d->subtotal,                          // AJUSTAR
            ]),
        ],
    ]);
}
public function actualizarDatos(Request $request)
{
    $cliente = $request->user()->cliente;

    abort_if(! $cliente, 404);

    $datos = $request->validate([
        'nombre'    => ['required', 'string', 'max:255'],
        'direccion' => ['required', 'string', 'max:255'],
        'celular'   => ['required', 'string', 'max:30'],
        'dia'       => ['required', Rule::in([
            'lunes', 'martes', 'miercoles', 'jueves',
            'viernes', 'sabado', 'domingo',
        ])],
    ]);

    $cliente->update($datos);

    return back();
}
}