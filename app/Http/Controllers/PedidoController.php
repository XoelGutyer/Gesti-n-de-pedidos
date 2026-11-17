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
    $filtros = $request->only(['desde', 'hasta', 'cliente_id']);

    $pedidos = Pedido::with(['cliente', 'usuario', 'items.producto'])
        ->when($filtros['desde'] ?? null, fn ($q, $desde) => $q->whereDate('fecha', '>=', $desde))
        ->when($filtros['hasta'] ?? null, fn ($q, $hasta) => $q->whereDate('fecha', '<=', $hasta))
        ->when($filtros['cliente_id'] ?? null, fn ($q, $id) => $q->where('cliente_id', $id))
        ->latest()
        ->get();

    return Inertia::render('Pedidos/Index', [
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
            $total = 0;
            foreach ($request->items as $item) {
                $producto = Producto::findOrFail($item['producto_id']);
                $total += $producto->precio * $item['cantidad'];
            }
            $clientePorId = Cliente::where('id', $request->cliente_id)->first();

            $pedido = Pedido::create([
                'fecha' => now()->toDateString(),
                'nota' => '',
                'cliente' => $clientePorId->nombre,
                'direccion' => $clientePorId->direccion,
                'total' => $total,
                'cliente_id' => $request->cliente_id,
                'usuario_id' => Auth::id(),
            ]);

            foreach ($request->items as $item) {
                $producto = Producto::findOrFail($item['producto_id']);
                $pedido->items()->create([
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precioProducto' => $producto->precio,
                    'subtotal' => $item['cantidad'] * $producto->precio,
                    'pedido_id' => $pedido->id,
                    'costoProducto' => $producto->costo,
                ]);
                $producto->decrement('stock', $item['cantidad']);
            }

        });
        return redirect()
            ->route('pedidos.index')
            ->with('success', 'Producto creado correctamente.');
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
