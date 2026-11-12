<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        abort_if($request->user()->hasRole('cliente'), 403);

        $hoy       = today();
        $inicioMes = $hoy->copy()->startOfMonth();
        $desde     = $hoy->copy()->subDays(13);

        // Ventas por día (14 días, con 0 en los días sin pedidos)
        $porDia = DB::table('pedidos')
            ->where('fecha', '>=', $desde->toDateString())
            ->selectRaw('fecha, SUM(total) as total')
            ->groupBy('fecha')
            ->pluck('total', 'fecha');

        $ventasPorDia = collect(range(0, 13))->map(function ($i) use ($desde, $porDia) {
            $dia = $desde->copy()->addDays($i);
            return [
                'dia'   => $dia->format('d/m'),
                'total' => (float) ($porDia[$dia->toDateString()] ?? 0),
            ];
        })->values();

        $masVendidos = DB::table('detalle_pedido')
            ->join('productos', 'productos.id', '=', 'detalle_pedido.producto_id')
            ->where('detalle_pedido.created_at', '>=', $inicioMes)
            ->selectRaw('productos.nombre, SUM(detalle_pedido.cantidad) as unidades')
            ->groupBy('productos.id', 'productos.nombre')
            ->orderByDesc('unidades')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'kpis' => [
                'ventasMes'      => (float) Pedido::where('fecha', '>=', $inicioMes)->sum('total'),
                'cobradoMes'     => (float) Pedido::where('fecha', '>=', $inicioMes)->where('pagado', true)->sum('total'),
                'pedidosHoy'     => Pedido::whereDate('fecha', $hoy)->count(),
                'pendientesPago' => Pedido::where('pagado', false)->count(),
            ],
            'ventasPorDia'   => $ventasPorDia,
            'ultimosPedidos' => Pedido::latest('id')->limit(8)
                                    ->get(['id', 'fecha', 'cliente', 'total', 'pagado']),
            'masVendidos'    => $masVendidos,
            'stockBajo'      => Producto::where('stock', '<=', 10)->orderBy('stock')
                                    ->limit(5)->get(['id', 'nombre', 'stock']),
        ]);
    }
}