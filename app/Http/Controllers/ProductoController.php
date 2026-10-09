<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Producto\ProductoRequest;
use App\Http\Requests\Producto\UpdateRequest;
class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $productos = Producto::with('proveedor')
        ->where('activo', true)
        ->get();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
        ]);
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
    public function store(ProductoRequest $request)
    {
        //
        $data = $request -> only(['nombre','precio','costo','stock','proveedor_id']);
        
        $data['imagen'] = null;
        
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $data['imagen'] = $file->store('productosImagenes', 'public');
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

   //como estamos usando route model binding, podemos cambiar el tipo de dato del parámetro $id a Producto 
   //y Laravel se encargará de buscar el producto por su id y pasarlo como parámetro a la función edit
    public function edit(Producto $producto)
    {
        $producto->load('proveedor');

        return Inertia::render('Productos/Edit', [
            'producto' => $producto,
            'proveedores' => Proveedor::pluck('nombre', 'id'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Producto $producto)
{
    $data = $request->only([
        'nombre',
        'precio',
        'costo',
        'stock',
        'proveedor_id',
    ]);

    if ($request->hasFile('imagen')) {
        $file = $request->file('imagen');

        $data['imagen'] = $file->store(
            'productosImagenes',
            'public'
        );

        if ($producto->imagen) {
            // Eliminar la imagen anterior si existe
            \Storage::disk('public')->delete($producto->imagen);
        }
    
    }

    $producto->update($data);

    return redirect()
        ->route('productos.index')
        ->with('success', 'Producto actualizado correctamente.');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
{
    $producto->update([
        'activo' => false,
    ]);

    return redirect()
        ->route('productos.index')
        ->with('success', 'Producto desactivado correctamente.');
}
}
