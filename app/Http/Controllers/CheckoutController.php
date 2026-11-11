<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    /** Formulario de checkout, con los datos del cliente ya cargados si existe. */
    public function create(Request $request)
    {
        $user = $request->user();
        $cliente = Cliente::where('user_id', $user->id)->first();

        return Inertia::render('TiendaOnline/checkout', [
            'cliente' => [
                'nombre' => $cliente?->nombre ?? $user->name,
                'email' => $cliente?->email ?? $user->email,
                'direccion' => $cliente?->direccion ?? '',
                'celular' => $cliente?->celular ?? '',
                'dia' => $cliente?->dia ?? '',
            ],
            'dias' => self::DIAS,
        ]);
    }

    /** Crea el pedido. Precios y stock se leen SIEMPRE de la base de datos. */
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:productos,id'],
            'items.*.cantidad' => ['required', 'integer', 'min:1', 'max:999'],
            'nombre' => ['required', 'string', 'max:255'],
            'direccion' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'celular' => ['required', 'string', 'max:30'],
            'dia' => ['required', Rule::in(self::DIAS)],
            'nota' => ['nullable', 'string', 'max:255'],
        ], [
            'items.required' => 'Tu carrito está vacío.',
            'items.min' => 'Tu carrito está vacío.',
        ]);

        $user = $request->user();

        // Si el mismo producto viene repetido, se suman las cantidades
        $cantidades = collect($data['items'])
            ->groupBy('id')
            ->map(fn ($grupo) => $grupo->sum('cantidad'));

        $pedido = DB::transaction(function () use ($data, $user, $cantidades) {
            // Bloquea las filas para que dos compras simultáneas no vendan el mismo stock
            $productos = Producto::whereIn('id', $cantidades->keys())
                ->where('activo', true)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($cantidades as $id => $cantidad) {
                $producto = $productos->get($id);

                if (! $producto) {
                    throw ValidationException::withMessages([
                        'items' => 'Un producto de tu carrito ya no está disponible.',
                    ]);
                }

                if ($producto->stock < $cantidad) {
                    throw ValidationException::withMessages([
                        'items' => "No hay stock suficiente de {$producto->nombre} (disponible: {$producto->stock}).",
                    ]);
                }
            }

            // Cliente del usuario: se crea en la primera compra y se reutiliza después
            $cliente = Cliente::withTrashed()->where('user_id', $user->id)->first() ?? new Cliente();
            $cliente->user_id = $user->id;
            $cliente->nombre = $data['nombre'];
            $cliente->direccion = $data['direccion'];
            $cliente->email = $data['email'];
            $cliente->celular = $data['celular'];
            $cliente->dia = $data['dia'];
            $cliente->deleted_at = null;
            $cliente->save();

            $total = 0;
            $lineas = [];

            foreach ($cantidades as $id => $cantidad) {
                $producto = $productos->get($id);
                $subtotal = round($producto->precio * $cantidad, 2);
                $total += $subtotal;

                $lineas[] = [
                    'producto' => $producto,
                    'cantidad' => $cantidad,
                    'subtotal' => $subtotal,
                ];
            }

            $pedido = Pedido::create([
                'fecha' => now()->toDateString(),
                'nota' => $data['nota'] ?? '',
                'cliente' => $cliente->nombre,
                'direccion' => $data['direccion'],
                'total' => round($total, 2),
                'pagado' => false,
                'usuario_id' => $user->id,
                'cliente_id' => $cliente->id,
            ]);

            foreach ($lineas as $linea) {
                DetallePedido::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $linea['producto']->id,
                    'cantidad' => $linea['cantidad'],
                    'precioProducto' => $linea['producto']->precio,
                    'costoProducto' => $linea['producto']->costo,
                    'subtotal' => $linea['subtotal'],
                ]);

                $linea['producto']->decrement('stock', $linea['cantidad']);
            }

            return $pedido;
        });

        return redirect()->route('pedidos.confirmacion', $pedido);
    }

    /** Pantalla de confirmación: solo la puede ver el dueño del pedido. */
    public function confirmacion(Request $request, Pedido $pedido)
    {
        abort_unless($pedido->usuario_id === $request->user()->id, 403);

        $pedido->load('items.producto');

        return Inertia::render('TiendaOnline/pedido-confirmado', [
            'pedido' => [
                'id' => $pedido->id,
                'fecha' => $pedido->fecha->format('d/m/Y'),
                'cliente' => $pedido->cliente,
                'direccion' => $pedido->direccion,
                'nota' => $pedido->nota,
                'total' => $pedido->total,
                'pagado' => $pedido->pagado,
                // No se envía costoProducto al navegador
                'detalles' => $pedido->items->map(fn ($d) => [
                    'id' => $d->id,
                    'nombre' => $d->producto?->nombre,
                    'cantidad' => $d->cantidad,
                    'precio' => $d->precioProducto,
                    'subtotal' => $d->subtotal,
                ]),
            ],
        ]);
    }
}