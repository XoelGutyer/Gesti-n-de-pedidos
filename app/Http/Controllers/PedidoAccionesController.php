<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PedidoAccionesController extends Controller
{
    public function remitos(Request $request)
    {
        $this->autorizar($request);

        $ids = $request->validate([
            'ids'   => ['required', 'array', 'min:1', 'max:100'],
            'ids.*' => ['integer', 'exists:pedidos,id'],
        ])['ids'];

        $pedidos = Pedido::with('items.producto')->whereIn('id', $ids)->orderBy('id')->get();

        return view('remitos', compact('pedidos'));
    }

    public function marcarPagado(Request $request, Pedido $pedido)
    {
        $this->autorizar($request);

        if ($pedido->pagado) {
            return back()->with('success', "El pedido #{$pedido->id} ya estaba pagado.");
        }

        $pedido->update(['pagado' => true]);

        return back()->with('success', "Pedido #{$pedido->id} marcado como pagado.");
    }

    public function editarItems(Request $request, Pedido $pedido)
    {
        $this->autorizar($request);

        if ($pedido->pagado) {
            return redirect('/pedidos')->with('success', 'Un pedido pagado no se puede editar.');
        }

        $items = DB::table('detalle_pedido')
            ->where('pedido_id', $pedido->id)
            ->get(['producto_id', 'cantidad']);

        $enPedido = $items->pluck('cantidad', 'producto_id');

        $productos = Producto::where('activo', true)
            ->orWhereIn('id', $enPedido->keys())
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'precio', 'descuento', 'stock'])
            ->map(fn ($p) => [
                'id'         => $p->id,
                'nombre'     => $p->nombre,
                'precio'     => (float) $p->precio,
                'descuento'  => (float) $p->descuento,
                // lo que hay en stock más lo que este pedido ya tiene reservado
                'disponible' => (int) $p->stock + (int) ($enPedido[$p->id] ?? 0),
            ]);

        return Inertia::render('Pedidos/editar-items', [
            'pedido' => [
                'id'      => $pedido->id,
                'cliente' => $pedido->cliente, // texto guardado en el pedido
                'items'   => $items->map(fn ($i) => [
                    'producto_id' => (int) $i->producto_id,
                    'cantidad'    => (int) $i->cantidad,
                ])->values(),
            ],
            'productos' => $productos,
        ]);
    }

    public function actualizarItems(Request $request, Pedido $pedido)
    {
        $this->autorizar($request);

        $data = $request->validate([
            'items'               => ['required', 'array', 'min:1'],
            'items.*.producto_id' => ['required', 'integer', 'exists:productos,id'],
            'items.*.cantidad'    => ['required', 'integer', 'min:1'],
        ]);

        // Si el mismo producto viene dos veces, se suman
        $items = collect($data['items'])
            ->groupBy('producto_id')
            ->map(fn ($g, $id) => ['producto_id' => (int) $id, 'cantidad' => (int) $g->sum('cantidad')])
            ->values()
            ->all();

        DB::transaction(function () use ($pedido, $items) {
            $pedido = Pedido::whereKey($pedido->id)->lockForUpdate()->firstOrFail();

            if ($pedido->pagado) {
                throw ValidationException::withMessages([
                    'items' => 'El pedido ya está pagado y no se puede editar.',
                ]);
            }

            $viejos = DB::table('detalle_pedido')->where('pedido_id', $pedido->id)->get();

            $ids = $viejos->pluck('producto_id')
                ->merge(collect($items)->pluck('producto_id'))
                ->unique();

            $productos = Producto::whereIn('id', $ids)->lockForUpdate()->get()->keyBy('id');

            // 1) Devolver al stock lo que tenía el pedido
            foreach ($viejos as $v) {
                $productos[$v->producto_id]->stock += $v->cantidad;
            }

            DB::table('detalle_pedido')->where('pedido_id', $pedido->id)->delete();

            // 2) Cargar los ítems nuevos con precio y descuento actuales
            $total = 0;
            foreach ($items as $i => $it) {
                $p = $productos[$it['producto_id']];

                if ($p->stock < $it['cantidad']) {
                    throw ValidationException::withMessages([
                        "items.$i.cantidad" => "Stock insuficiente de {$p->nombre}.",
                    ]);
                }

                $descuento = min(max((float) $p->descuento, 0), 100);
                $subtotal  = round($p->precio * $it['cantidad'] * (1 - $descuento / 100), 2);
                $total    += $subtotal;

                DB::table('detalle_pedido')->insert([
                    'pedido_id'      => $pedido->id,
                    'producto_id'    => $p->id,
                    'cantidad'       => $it['cantidad'],
                    'precioProducto' => $p->precio,
                    'costoProducto'  => $p->costo ?? 0,
                    'subtotal'       => $subtotal,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);

                $p->stock -= $it['cantidad'];
            }

            foreach ($productos as $p) {
                $p->save(); // solo guarda los que cambiaron
            }

            $pedido->update(['total' => round($total, 2)]);
        });

        return redirect('/pedidos')->with('success', "Pedido #{$pedido->id} actualizado.");
    }

    private function autorizar(Request $request): void
    {
        $user = $request->user();
        abort_if($user->hasRole('cliente') || $user->hasRole('preventista'), 403);
    }
    public function detalle(Request $request, Pedido $pedido)
    {
        $this->autorizar($request);
    
        $pedido->load('items.producto', 'usuario');
    
        return Inertia::render('Pedidos/show', [
            'pedido' => [
                'id'             => $pedido->id,
                'fecha'          => $pedido->formato_fecha,
                'nota'           => $pedido->nota,
                'cliente'        => $pedido->cliente,   // texto guardado en el pedido
                'direccion'      => $pedido->direccion,
                'total'          => (float) $pedido->total,
                'pagado'         => (bool) $pedido->pagado,
                'mp_payment_id'  => $pedido->mp_payment_id,
                'registrado_por' => $pedido->usuario?->name,
                'items'          => $pedido->items->map(fn ($i) => [
                    'id'       => $i->id,
                    'producto' => $i->producto->nombre ?? 'Producto eliminado',
                    'cantidad' => (int) $i->cantidad,
                    'unitario' => $i->cantidad ? round((float) $i->subtotal / $i->cantidad, 2) : 0,
                    'costo'    => (float) $i->costoProducto,
                    'subtotal' => (float) $i->subtotal,
                ])->values(),
            ],
        ]);
    }
}