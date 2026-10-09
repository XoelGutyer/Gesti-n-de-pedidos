<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreProductoRequest;
class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Producto::with('proveedor')->get();
        return Inertia::render('Productos/Index',[
            'productos'=>$productos
        ]);
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //dd (Producto::get());
        return Inertia::render('Productos/Create',[
        'proveedores'=> Proveedor::pluck('nombre','id')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductoRequest $request)
    {
        //
        /*$datos = $request->validate([
            'nombre'=>'required|string|max:255',
            'precio'=>'required|numeric',
            'costo'=>'required|numeric',
            'stock'=>'required|integer',
            //'imagen'=>'nullable|image|max:2048',
            'proveedor_id'=>'required|exists:proveedors,id'
        ]);*/
        //dd($request->validated());
        
        //Producto::create($request->validated());
        $data = $request->validated();
        if($request->hasFile('imagen')){
            $file = $request->file('imagen');
            $nombreImagen = $file->store('images', 'public');
            $data['imagen'] = $nombreImagen;
        }
        Producto::create($data);
        return redirect()
            ->route('productos.index')
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
    public function edit(Producto $producto)
    {
        //dd($producto);
        return Inertia::render('Productos/Edit',[
            'producto'=>$producto,
            'proveedores'=> Proveedor::pluck('nombre','id')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProductoRequest $request, Producto $producto)
    {
        //
        $producto->update($request->validated());
        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        $producto->delete();
        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto eliminado correctamente.');
        //
    }
}
