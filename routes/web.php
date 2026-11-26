<?php

use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrdenController;
use App\Http\Controllers\PapeleraController;
use App\Http\Controllers\PedidoAccionesController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ReporteController;
use App\Models\Producto;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Públicas
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome', [
        'productos' => Producto::where('activo', true)
            ->where('stock', '>', 0)
            ->latest()
            ->get([
                'id',
                'nombre',
                'precio',
                'descuento',
                'stock',
                'imagen',
            ])
            ->map(fn ($p) => [
                'id' => $p->id,
                'nombre' => $p->nombre,
                'precio' => $p->precio,
                'descuento' => $p->descuento,
                'stock' => $p->stock,
                'imagen' => $p->imagen
                    ? asset('storage/' . $p->imagen)
                    : null,
            ]),
    ]);
})->name('home');


/*
|--------------------------------------------------------------------------
| Autenticadas (todas requieren login y email verificado)
|--------------------------------------------------------------------------
| Se agrupan por rol de menor a mayor alcance:
|   1. cliente + admin        -> tienda online
|   2. preventista + admin    -> consulta / gestión operativa
|   3. solo admin             -> administración completa
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Punto de entrada tras el login: cada rol va a su pantalla
    Route::get('/inicio', function (Request $request) {
        return in_array($request->user()->role, ['admin', 'preventista'], true)
            ? redirect()->route('dashboard')
            : redirect()->route('mi-cuenta');
    })->name('inicio');


    // ---------------------------------------------------------------
    // Tienda online: cliente y admin
    // ---------------------------------------------------------------
    Route::middleware('role:cliente,admin,preventista')->group(function () {
        Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
        Route::get('/pedidos/{pedido}/confirmacion', [CheckoutController::class, 'confirmacion'])
            ->name('pedidos.confirmacion');
        Route::get('/mi-cuenta', [CuentaController::class, 'index'])->name('mi-cuenta');
        Route::post('/pedidos/{pedido}/pagar', [CheckoutController::class, 'pagar'])->name('pedidos.pagar');
        Route::get('/mi-cuenta/pedidos/{pedido}', [CuentaController::class, 'pedido'])
    ->name('mi-cuenta.pedido');
        Route::patch('/mi-cuenta/datos', [CuentaController::class, 'actualizarDatos'])
    ->name('mi-cuenta.datos');
    });

    // ---------------------------------------------------------------
    // Operativas: preventista y admin
    // ---------------------------------------------------------------
    Route::middleware('role:preventista,admin')->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('/proveedores', [ProveedorController::class, 'index'])->name('proveedores.index');
        Route::get('/pedidos', [PedidoController::class, 'index'])->name('pedidos.index');
        Route::get('/usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
        Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
        Route::get('/clientes/create', [ClienteController::class, 'create'])->name('clientes.create');
        Route::post('/clientes', [ClienteController::class, 'store'])->name('clientes.store');
        Route::get('/productos', [ProductoController::class, 'index'])->name('productos.index');
        Route::get('/ordenes', [OrdenController::class, 'index'])->name('ordenes.index');
        Route::get('/pedidos/create', [PedidoController::class, 'create'])->name('pedidos.create');
        Route::post('/pedidos', [PedidoController::class, 'store'])->name('pedidos.store');
    });

    // ---------------------------------------------------------------
    // Administración: solo admin
    // ---------------------------------------------------------------
    Route::middleware('role:admin')->group(function () {

        // Proveedores (el index está en el grupo preventista/admin)
        Route::controller(ProveedorController::class)->group(function () {
            Route::get('/proveedores/create', 'create')->name('proveedores.create');
            Route::post('/proveedores', 'store')->name('proveedores.store');
            Route::get('/proveedores/{proveedor}/edit', 'edit')->name('proveedores.edit');
            Route::put('/proveedores/{proveedor}', 'update')->name('proveedores.update');
            Route::delete('/proveedores/{proveedor}', 'destroy')->name('proveedores.destroy');
        });

        // Productos
        Route::controller(ProductoController::class)->group(function () {
            Route::get('/productos/create', 'create')->name('productos.create');
            Route::post('/productos', 'store')->name('productos.store');
            Route::get('/productos/{producto}/edit', 'edit')->name('productos.edit');
            Route::put('/productos/{producto}', 'update')->name('productos.update');
            Route::delete('/productos/{producto}', 'destroy')->name('productos.destroy');
            Route::get('/catalogo/pdf', 'pdf')->name('catalogo.pdf');
        });

        // Clientes
Route::resource('clientes', ClienteController::class)->except(['index', 'create', 'store']);

        // Pedidos (las rutas fijas van antes que las que tienen {pedido})
        Route::controller(PedidoController::class)->group(function () {
            Route::patch('/pedidos/{pedido}/estado', 'cambiarEstado');
        });

        Route::controller(PedidoAccionesController::class)->group(function () {
            Route::get('pedidos/remitos', 'remitos');
            Route::get('pedidos/{pedido}', 'detalle')->whereNumber('pedido');
            Route::get('pedidos/{pedido}/editar-items', 'editarItems');
            Route::put('pedidos/{pedido}/items', 'actualizarItems');
            Route::patch('pedidos/{pedido}/marcar-pagado', 'marcarPagado');
        });

        // Órdenes (create antes que {orden})
        Route::controller(OrdenController::class)->group(function () {
            Route::get('/ordenes/create', 'create')->name('ordenes.create');
            Route::post('/ordenes', 'store')->name('ordenes.store');
            Route::get('/ordenes/{orden}', 'show')->name('ordenes.show');
            Route::get('/ordenes/{orden}/edit', 'edit')->name('ordenes.edit');
            Route::put('/ordenes/{orden}', 'update')->name('ordenes.update');
            Route::delete('/ordenes/{orden}', 'destroy')->name('ordenes.destroy');
            Route::patch('/ordenes/{orden}/estado', 'actualizarEstado')->name('ordenes.actualizar-estado');
        });

        // Usuarios (el index está en el grupo preventista/admin)
        Route::patch('/usuarios/{user}/rol', [UsuarioController::class, 'updateRole'])
            ->name('usuarios.update-role');

        // Papelera
        Route::controller(PapeleraController::class)->prefix('papelera')->group(function () {
            Route::get('/', 'index')->name('papelera.index');
            Route::patch('/productos/{producto}/activar', 'activarProducto')->name('papelera.productos.activar');
            Route::patch('/proveedores/{proveedor}/activar', 'activarProveedor')->name('papelera.proveedores.activar');
            Route::put('/clientes/{cliente}/restaurar', 'restaurarCliente')->name('papelera.clientes.activar');
        });

        // Reportes
        Route::controller(ReporteController::class)->prefix('reportes')->group(function () {
            Route::get('/ventas-proveedores', 'ventasPorProveedor');
            Route::get('/ventas-proveedores/exportar', 'exportar');
        });
    });
});

require __DIR__.'/settings.php';
