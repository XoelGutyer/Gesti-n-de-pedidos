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

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pedidos = Pedido::with(['cliente', 'usuario', 'items.producto'])
            ->latest()
            ->get();
        return Inertia::render('Pedidos/Index', [
            'pedidos' => $pedidos,
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
