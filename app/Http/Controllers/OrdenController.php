<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrdenRequest;
use App\Models\DetalleOrden;
use App\Models\Orden;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Proveedor;

class OrdenController extends Controller
{
    /**
     * Display a listing of the resource.
     */

public function index(Request $request)
{
    $orden = $request->input('orden', 'nombre');
    $direccion = $request->input('direccion', 'asc');

    $camposPermitidos = ['nombre', 'estado', 'total'];

    if (!in_array($orden, $camposPermitidos, true)) {
        $orden = 'nombre';
    }

    if (!in_array($direccion, ['asc', 'desc'], true)) {
        $direccion = 'asc';
    }

    $ordenes = Orden::with(['proveedor:id,nombre', 'usuario:id,name', 'items'])
        ->when($request->filled('proveedor'), function ($query) use ($request) {
            $query->where('ordenes.proveedor_id', $request->input('proveedor'));
        })
        ->when($request->filled('desde'), function ($query) use ($request) {
            $query->whereDate('ordenes.created_at', '>=', $request->input('desde'));
        })
        ->when($request->filled('hasta'), function ($query) use ($request) {
            $query->whereDate('ordenes.created_at', '<=', $request->input('hasta'));
        })
        ->when($orden === 'nombre', function ($query) use ($direccion) {
            $query->join('proveedores', 'ordenes.proveedor_id', '=', 'proveedores.id')
                ->orderBy('proveedores.nombre', $direccion)
                ->select('ordenes.*');
        }, function ($query) use ($orden, $direccion) {
            $query->orderBy("ordenes.{$orden}", $direccion);
        })
        ->get();

    return Inertia::render('Ordenes/Index', [
        'ordenes' => $ordenes,
        'proveedores' => Proveedor::orderBy('nombre')->pluck('nombre', 'id'),
        'filtros' => [
            'proveedor' => $request->input('proveedor', ''),
            'desde' => $request->input('desde', ''),
            'hasta' => $request->input('hasta', ''),
            'orden' => $orden,
            'direccion' => $direccion,
        ],
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('Ordenes/Create', [
            'proveedores' => \App\Models\Proveedor::all(['id', 'nombre']),
            'productos' => Producto::all(['id', 'nombre', 'costo', 'stock', 'proveedor_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrdenRequest $request)
    {
        $validated = $request->validated();
        try{
            DB::transaction(function () use ($validated) {
                $total = collect($validated['items'])->sum(function ($item) {
                    return $item['cantidad'] * $item['costoProducto'];
                });

                $orden = Orden::create([
                    'total' => $total,
                    'estado' => 'solicitado',
                    'usuario_id' => Auth::id(),
                    'proveedor_id' => $validated['proveedor_id'],
                ]);

                foreach ($validated['items'] as $item) {
                    $producto = Producto::findOrFail($item['producto_id']);
                    DetalleOrden::create([
                        'orden_id' => $orden->id,
                        'producto_id' => $item['producto_id'],
                        'cantidad' => $item['cantidad'],
                        'costoProducto' => $producto->costo,
                    ]);
                }
            });
            return redirect()
                ->route('pedidos.index')
                ->with('success', 'Orden creada exitosamente');
        }
        catch (\Exception $e) {
            return redirect()
                ->route('ordenes.index')
                ->with('error', 'Error al crear la orden');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Orden $orden)
    {
        //
        $orden->load([
            'proveedor',
            'usuario:id,name',
            'items.producto:id,nombre,stock',
        ]);
        //dd($orden);
        return Inertia::render('Ordenes/show', [
            'orden' => $orden,
        ]);
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

    public function actualizarEstado(Request $request, Orden $orden){
        
        $validated = $request->validate([
            'estado' => 'required|in:solicitado,recibido,cancelado',
        ]);
        $nuevoEstado = $validated['estado']; 
        $anteriorEstado = $orden->estado;
        
        if($nuevoEstado ===$anteriorEstado){
            return back();
        }

        if(in_array($anteriorEstado, ['recibido', 'cancelado'])){
            return back()->with('error', 'No se puede modificar el estado de una orden cancelada o recibida');
        }
        
        try{
            DB::transaction(function () use ($orden, $nuevoEstado, $anteriorEstado) {
                $orden->update(['estado' => $nuevoEstado]);

                if($nuevoEstado === 'recibido'){
                    foreach($orden->items as $item ){
                        $producto = Producto::lockForUpdate()->find($item->producto_id);                    
                        $producto->increment('stock', $item->cantidad);

                        //$producto->update(['costo'=> $item->cost]);
                    }
                }
            });
            $mensaje = $nuevoEstado ==='recibido' ? 'Mercaderia marcada como recibida y stock actualizado'
            : 'Estado de la orden actualizado correctamente.';
            return back()->with('success', $mensaje);
        }
        catch(\Exception $e){
            return back()->with('error', 'Error al actualizar el estado ' . $e->getMessage());
        }
    }
}
