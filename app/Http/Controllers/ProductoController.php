<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Producto\StoreRequest;
use App\Http\Requests\Producto\UpdateRequest;
use Barryvdh\DomPDF\Facade\Pdf;
//PARA LA OPTIMIZACION DE IMAGENES
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;

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

public function store(StoreRequest $request)
{
    $data = $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric|between:0,999999999.99',
        'costo' => 'required|numeric|between:0,999999999.99',
        'stock' => 'required|integer|between:0,1000000',
        'proveedor_id' => 'required|integer|exists:proveedores,id',
        'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    unset($data['imagen']);

    if ($request->hasFile('imagen')) {
        $manager = new ImageManager(new Driver());

        $imagen = $manager
    ->decode($request->file('imagen'))
    ->scaleDown(width: 1200, height: 1200)
    ->encodeUsingFormat(Format::WEBP, quality: 82);

        $ruta = 'productosImagenes/' . uniqid('producto_') . '.webp';

        Storage::disk('public')->put($ruta, (string) $imagen);

        $data['imagen'] = $ruta;
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
        $manager = new ImageManager(new Driver());

        $imagen = $manager
    ->decode($request->file('imagen'))
    ->scaleDown(width: 1200, height: 1200)
    ->encodeUsingFormat(Format::WEBP, quality: 82);

        $ruta = 'productosImagenes/' . uniqid('producto_') . '.webp';

        Storage::disk('public')->put($ruta, (string) $imagen);

        $data['imagen'] = $ruta;
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

 public function pdf()
    {
        $productos = Producto::with('proveedor')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        // Preparar la ruta local de cada imagen.
        // Se asume que las imágenes están en el disco public de Laravel.
        foreach ($productos as $producto) {
            $producto->imagen_pdf = null;

            if (
                $producto->imagen &&
                Storage::disk('public')->exists($producto->imagen)
            ) {
                $producto->imagen_pdf = Storage::disk('public')
                    ->path($producto->imagen);
            }
        }

        // Agrupar los productos por proveedor.
        $proveedores = $productos
            ->sortBy(fn ($producto) =>
                mb_strtolower($producto->proveedor?->nombre ?? 'Sin proveedor')
                . '|'
                . mb_strtolower($producto->nombre)
            )
            ->groupBy(fn ($producto) =>
                $producto->proveedor?->nombre ?? 'Sin proveedor'
            );

        $pdf = Pdf::loadView('pdf.catalogo', [
            'proveedores' => $proveedores,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('catalogo-productos.pdf');
    }
}
