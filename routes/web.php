<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\PapeleraController;
use App\Http\Controllers\PedidoController;

use App\Models\Category;
use App\Models\Producto;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'productos' => Producto::where('activo', true)
            ->where('stock', '>', 0)
            ->latest()
            ->get(['id', 'nombre', 'precio', 'stock', 'imagen'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'nombre' => $p->nombre,
                'precio' => $p->precio,
                'stock' => $p->stock,
                'imagen' => $p->imagen ? asset('storage/'.$p->imagen) : null,
            ]),
    ]);
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    //el primer dashboard es la ruta /dashboard y el segundo es la vista pages/dashboard.tsx
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

//podemos poner 'role:admin,preventista,cliente' segun el control de acceso que quieramos para cada ruta
//al final del proyecto ordenaremos las rutas 
Route::middleware(['auth', 'verified','role:admin,preventista,cliente'])->group(function () {

    Route::get('/proveedores',[ProveedorController::class,'index'])->name('proveedores.index');
    Route::get('/proveedores/create',[ProveedorController::class,'create'])->name('proveedores.create');
    Route::post('/proveedores',[ProveedorController::class,'store'])->name('proveedores.store');
    Route::get('/proveedores/{proveedor}/edit',[ProveedorController::class,'edit'])->name('proveedores.edit');
    Route::put('/proveedores/{proveedor}',[ProveedorController::class,'update'])->name('proveedores.update');
    Route::delete('/proveedores/{proveedor}',[ProveedorController::class,'destroy'])->name('proveedores.destroy');

    Route::get('/pedidos',[PedidoController::class,'index'])->name('pedidos.index');
    Route::get('/pedidos/create',[PedidoController::class,'create'])->name('pedidos.create');
    Route::post('/pedidos',[PedidoController::class,'store'])->name('pedidos.store');
});

Route::middleware(['auth', 'verified','role:admin,preventista'])->group(function () {
    
    //lo meti dentro del middleware para que solo los usuarios autenticados puedan acceder a estas rutas
    Route::get('/productos',[ProductoController::class,'index'])->name('productos.index');
    Route::get('/productos/create',[ProductoController::class,'create'])->name('productos.create');
    Route::post('/productos',[ProductoController::class,'store'])->name('productos.store');
    Route::get('/productos/{producto}/edit',[ProductoController::class,'edit'])->name('productos.edit');
    Route::put('/productos/{producto}',[ProductoController::class,'update'])->name('productos.update');
    Route::delete('/productos/{producto}',[ProductoController::class,'destroy'])->name('productos.destroy');
    Route::get('/catalogo/pdf', [ProductoController::class, 'pdf'])
    ->name('catalogo.pdf');
    //no seria mejor utilizar: 
    //Route::resource('productos', ProductoController::class);
    //para que quede mas limpio el codigo? (crea las rutas por defecto, las puedes ver con php artisan route:list)
    //si para las proximas rutas que hagamos utilicemos es solo para aprender bien el flujo de la informacion
    Route::resource('clientes', ClienteController::class);
});

Route::middleware(['auth','role:admin,cliente'])->group(function () {
    Route::get('/usuarios', [UsuarioController::class, 'index'])
        ->name('usuarios.index');

    Route::patch('/usuarios/{user}/rol', [UsuarioController::class, 'updateRole'])
        ->name('usuarios.update-role');
});

//rutas de la papelera
Route::middleware('auth')->group(function () {
    Route::get('/papelera', [PapeleraController::class, 'index'])
        ->name('papelera.index');

    Route::patch(
        '/papelera/productos/{producto}/activar',
        [PapeleraController::class, 'activarProducto']
    )->name('papelera.productos.activar');

    Route::patch(
        '/papelera/proveedores/{proveedor}/activar',
        [PapeleraController::class, 'activarProveedor']
    )->name('papelera.proveedores.activar');

    Route::put(
        '/papelera/clientes/{cliente}/restaurar',
        [PapeleraController::class,'restaurarCliente']
    )->name('papelera.clientes.activar');
});
//para la tienda online
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CuentaController;

Route::middleware('auth')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/pedidos/{pedido}/confirmacion', [CheckoutController::class, 'confirmacion'])
        ->name('pedidos.confirmacion');
    Route::get('/mi-cuenta', [CuentaController::class, 'index'])->name('mi-cuenta');
});

require __DIR__.'/settings.php';
