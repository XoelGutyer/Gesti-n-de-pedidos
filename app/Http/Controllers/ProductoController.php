<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\ProductoRequest;
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
    public function store(ProductoRequest $request)
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
        Producto::create($request->validated());
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
    public function edit(Producto $id)
    {
        //
        echo $id;
        $id->update([
            'nombre'=>'producto1',
            'precio'=>'80',
            'costo'=>'30',
            'stock'=>'3',
            //'imagen'=>'/apple-touch-icon.png',
            //'proveedor_id'=>'1',
        ]);
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
    public function destroy(Producto $id)
    {
        $id->delete();
        //
    }
}
