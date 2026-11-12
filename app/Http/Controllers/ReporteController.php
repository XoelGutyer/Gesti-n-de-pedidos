<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReporteController extends Controller
{
    public function ventasPorProveedor(Request $request)
    {
        $this->autorizar($request);
        [$desde, $hasta] = $this->rango($request);

        $proveedores = $this->agrupar($this->consulta($desde, $hasta));

        $monto = round($proveedores->sum('monto'), 2);
        $costo = round($proveedores->sum('costo'), 2);

        return Inertia::render('reportes/ventas-proveedores', [
            'desde'       => $desde,
            'hasta'       => $hasta,
            'proveedores' => $proveedores,
            'totales'     => [
                'unidades' => $proveedores->sum('unidades'),
                'monto'    => $monto,
                'costo'    => $costo,
                'ganancia' => round($monto - $costo, 2),
            ],
        ]);
    }

    public function exportar(Request $request)
    {
        $this->autorizar($request);
        [$desde, $hasta] = $this->rango($request);
        $filas = $this->consulta($desde, $hasta);

        $num = fn ($n) => number_format((float) $n, 2, ',', '');

        return response()->streamDownload(function () use ($filas, $num) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // BOM para que Excel respete los acentos
            fputcsv($out, ['Proveedor', 'Producto', 'Unidades', 'Venta', 'Costo', 'Ganancia'], ';');
            foreach ($filas as $f) {
                fputcsv($out, [
                    $f->proveedor,
                    $f->producto,
                    (int) $f->unidades,
                    $num($f->monto),
                    $num($f->costo),
                    $num($f->monto - $f->costo),
                ], ';');
            }
            fclose($out);
        }, "ventas-por-proveedor_{$desde}_{$hasta}.csv", [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function autorizar(Request $request): void
    {
        $user = $request->user();
        abort_if($user->hasRole('cliente') || $user->hasRole('preventista'), 403);
    }

    private function rango(Request $request): array
    {
        $datos = $request->validate([
            'desde' => ['nullable', 'date'],
            'hasta' => ['nullable', 'date', 'after_or_equal:desde'],
        ]);

        return [
            $datos['desde'] ?? today()->startOfMonth()->toDateString(),
            $datos['hasta'] ?? today()->toDateString(),
        ];
    }

    private function consulta(string $desde, string $hasta)
    {
        // wrap() escapa el nombre de columna según el motor de base de datos
        $costo = DB::getQueryGrammar()->wrap('d.costoProducto');

        return DB::table('detalle_pedido as d')
            ->join('pedidos as p', 'p.id', '=', 'd.pedido_id')
            ->join('productos as pr', 'pr.id', '=', 'd.producto_id')
            ->join('proveedores as pv', 'pv.id', '=', 'pr.proveedor_id')
            ->whereBetween('p.fecha', [$desde, $hasta])
            ->selectRaw("pv.id as proveedor_id, pv.nombre as proveedor,
                         pr.id as producto_id, pr.nombre as producto,
                         SUM(d.cantidad) as unidades,
                         SUM(d.subtotal) as monto,
                         SUM(d.cantidad * {$costo}) as costo")
            ->groupBy('pv.id', 'pv.nombre', 'pr.id', 'pr.nombre')
            ->orderBy('pv.nombre')
            ->orderByDesc('unidades')
            ->get();
    }

    private function agrupar($filas)
    {
        return $filas->groupBy('proveedor_id')->map(function ($items) {
            $monto = round((float) $items->sum('monto'), 2);
            $costo = round((float) $items->sum('costo'), 2);

            return [
                'id'        => $items->first()->proveedor_id,
                'nombre'    => $items->first()->proveedor,
                'unidades'  => (int) $items->sum('unidades'),
                'monto'     => $monto,
                'costo'     => $costo,
                'ganancia'  => round($monto - $costo, 2),
                'productos' => $items->map(fn ($f) => [
                    'id'       => $f->producto_id,
                    'nombre'   => $f->producto,
                    'unidades' => (int) $f->unidades,
                    'monto'    => round((float) $f->monto, 2),
                    'costo'    => round((float) $f->costo, 2),
                    'ganancia' => round((float) $f->monto - (float) $f->costo, 2),
                ])->values(),
            ];
        })->values();
    }
}