<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePedidoRequest;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Enums\EstadoPedido;
use Illuminate\Validation\Rule;
use App\Mail\EstadoPedidoActualizado;
use Illuminate\Support\Facades\Mail;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    $user = $request->user();

    $filtros = $request->only(['desde', 'hasta', 'cliente_id']);

    $pedidos = Pedido::query()
        ->visibleTo($user)
        ->with(['cliente', 'usuario', 'items.producto'])
        ->when($filtros['desde'] ?? null, fn ($q, $desde) => $q->whereDate('fecha', '>=', $desde))
        ->when($filtros['hasta'] ?? null, fn ($q, $hasta) => $q->whereDate('fecha', '<=', $hasta))
        ->when($filtros['cliente_id'] ?? null, fn ($q, $id) => $q->where('cliente_id', $id))
        ->latest()
        ->get();

    return Inertia::render('Pedidos/Index', [
        'usuario' => $user->only(['id', 'name', 'role']),
        'pedidos'  => $pedidos,
        'clientes' => Cliente::orderBy('nombre')->get(['id', 'nombre', 'email']),
        'filtros'  => $filtros,
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Pedidos/Create', [
            'clientes' => Cliente::all(['id', 'nombre', 'email']),
            'productos' => Producto::all(['id', 'nombre', 'precio', 'stock', 'costo'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(StorePedidoRequest $request)
{
    DB::transaction(function () use ($request) {
        $clientePorId = Cliente::where('id', $request->cliente_id)->first();

        // Primero armamos los ítems con el descuento aplicado
        $lineas = [];
        $total = 0;

        foreach ($request->items as $item) {
            $producto = Producto::findOrFail($item['producto_id']);

            $descuento = min(max((int) $producto->descuento, 0), 100);
            $subtotal  = round($producto->precio * $item['cantidad'] * (1 - $descuento / 100), 2);
            $total    += $subtotal;

            $lineas[] = [
                'producto'  => $producto,
                'cantidad'  => $item['cantidad'],
                'descuento' => $descuento,
                'subtotal'  => $subtotal,
            ];
        }

        $pedido = Pedido::create([
            'fecha' => now()->toDateString(),
            'nota' => '',
            'cliente' => $clientePorId->nombre,
            'direccion' => $clientePorId->direccion,
            'total' => round($total, 2),
            'cliente_id' => $request->cliente_id,
            'usuario_id' => Auth::id(),
        ]);

        // Después guardamos cada ítem con su descuento
        foreach ($lineas as $l) {
            $pedido->items()->create([
                'producto_id' => $l['producto']->id,
                'cantidad' => $l['cantidad'],
                'precioProducto' => $l['producto']->precio,
                'descuento' => $l['descuento'],
                'subtotal' => $l['subtotal'],
                'pedido_id' => $pedido->id,
                'costoProducto' => $l['producto']->costo,
            ]);
            $l['producto']->decrement('stock', $l['cantidad']);
        }
    });

    return redirect()
        ->route('pedidos.index')
        ->with('success', 'Pedido creado correctamente.');
}

public function cambiarEstado(Request $request, Pedido $pedido)
{
    $validated = $request->validate([
        'estado' => ['required', Rule::enum(EstadoPedido::class)],
    ]);

    $pedido->update($validated);

    // Solo envía el mail si el estado realmente cambió
    if ($pedido->wasChanged('estado')) {
        $cliente = $pedido->cliente()->first();

        if ($cliente?->email) {
            $estado = EstadoPedido::from($validated['estado']);

            $data = [
                'cliente'   => $cliente->nombre,
                'email'     => $cliente->email,
                'pedido_id' => $pedido->id,
                'estado'    => $estado->label(),
                'mensaje'   => $estado->mensaje(),
                'direccion' => $pedido->direccion,
            ];

            try {
                Mail::to($data['email'])->send(new EstadoPedidoActualizado($data));
            } catch (\Throwable $e) {
                report($e); // el estado igual queda guardado si falla el mail
            }
        }
    }

    return back();
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
