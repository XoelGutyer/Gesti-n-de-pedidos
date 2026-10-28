<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Proveedor;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PapeleraController extends Controller
{
    public function index(): Response
    {
        $productos = Producto::where('activo', false)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'precio', 'stock']);

        $proveedores = Proveedor::where('activo', false)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $clientes = Cliente::onlyTrashed()->latest()->get();

        return Inertia::render('Papelera/Index', [
            'productos' => $productos,
            'proveedores' => $proveedores,
            'clientes' => $clientes,
        ]);
    }

    public function activarProducto(
        Producto $producto
    ): RedirectResponse {
        $producto->update(['activo' => true]);

        return back()->with(
            'success',
            'Producto reactivado correctamente.'
        );
    }

    public function activarProveedor(
        Proveedor $proveedor
    ): RedirectResponse {
        $proveedor->update(['activo' => true]);

        return back()->with(
            'success',
            'Proveedor reactivado correctamente.'
        );
    }

    public function restaurarCliente(int $id){
        $cliente = Cliente::withTrashed()->findOrFail($id);
        $cliente->restore();
        return back()->with(            
            'success',
            'Proveedor reactivado correctamente.'
        );
    }
}