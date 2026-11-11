<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

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
}