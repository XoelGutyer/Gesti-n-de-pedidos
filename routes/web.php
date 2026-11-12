<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\PapeleraController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\DashboardController;
use App\Models\Category;
use App\Models\Producto;
use Inertia\Inertia;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\PedidoAccionesController;



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
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

//podemos poner 'role:admin,preventista,cliente' segun el control de acceso que quieramos para cada ruta
//al final del proyecto ordenaremos las rutas 
Route::middleware(['auth', 'verified','role:admin,preventista,cliente'])->group(function () {
    //proveedores
    Route::get('/proveedores',[ProveedorController::class,'index'])->name('proveedores.index');
    Route::get('/proveedores/create',[ProveedorController::class,'create'])->name('proveedores.create');
    Route::post('/proveedores',[ProveedorController::class,'store'])->name('proveedores.store');
    Route::get('/proveedores/{proveedor}/edit',[ProveedorController::class,'edit'])->name('proveedores.edit');
    Route::put('/proveedores/{proveedor}',[ProveedorController::class,'update'])->name('proveedores.update');
    Route::delete('/proveedores/{proveedor}',[ProveedorController::class,'destroy'])->name('proveedores.destroy');
    //pedidos
    Route::get('/pedidos',[PedidoController::class,'index'])->name('pedidos.index');
    Route::get('/pedidos/create',[PedidoController::class,'create'])->name('pedidos.create');
    Route::post('/pedidos',[PedidoController::class,'store'])->name('pedidos.store');
    //pedidos acciones
    Route::get('pedidos/remitos', [PedidoAccionesController::class, 'remitos']);
    Route::patch('pedidos/{pedido}/marcar-pagado', [PedidoAccionesController::class, 'marcarPagado']);
    Route::get('pedidos/{pedido}/editar-items', [PedidoAccionesController::class, 'editarItems']);
    Route::put('pedidos/{pedido}/items', [PedidoAccionesController::class, 'actualizarItems']);
    Route::get('pedidos/{pedido}', [PedidoAccionesController::class, 'detalle'])->whereNumber('pedido');
    //productos
    Route::get('/productos',[ProductoController::class,'index'])->name('productos.index');
    Route::get('/productos/create',[ProductoController::class,'create'])->name('productos.create');
    Route::post('/productos',[ProductoController::class,'store'])->name('productos.store');
    Route::get('/productos/{producto}/edit',[ProductoController::class,'edit'])->name('productos.edit');
    Route::put('/productos/{producto}',[ProductoController::class,'update'])->name('productos.update');
    Route::delete('/productos/{producto}',[ProductoController::class,'destroy'])->name('productos.destroy');
    Route::get('/catalogo/pdf', [ProductoController::class, 'pdf'])
    ->name('catalogo.pdf');
    //clientes
    Route::resource('clientes', ClienteController::class);
    //usuarios
    Route::get('/usuarios', [UsuarioController::class, 'index'])
        ->name('usuarios.index');
    Route::patch('/usuarios/{user}/rol', [UsuarioController::class, 'updateRole'])
        ->name('usuarios.update-role');
    //papelera
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
    //tienda online
    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/pedidos/{pedido}/confirmacion', [CheckoutController::class, 'confirmacion'])
        ->name('pedidos.confirmacion');
    Route::get('/mi-cuenta', [CuentaController::class, 'index'])->name('mi-cuenta');
    //reportes
    Route::get('reportes/ventas-proveedores', [ReporteController::class, 'ventasPorProveedor']);
    Route::get('reportes/ventas-proveedores/exportar', [ReporteController::class, 'exportar']);
});

require __DIR__.'/settings.php';
