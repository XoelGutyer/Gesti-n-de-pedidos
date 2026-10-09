<?php

use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProveedorController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    //el primer dashboard es la ruta /dashboard y el segundo es la vista pages/dashboard.tsx
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/proveedores',[ProveedorController::class,'index'])->name('proveedores.index');
    Route::get('/proveedores/create',[ProveedorController::class,'create'])->name('proveedores.create');
    Route::post('/proveedores',[ProveedorController::class,'store'])->name('proveedores.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    
    //lo meti dentro del middleware para que solo los usuarios autenticados puedan acceder a estas rutas
    Route::get('/productos',[ProductoController::class,'index'])->name('productos.index');
    Route::get('/productos/create',[ProductoController::class,'create'])->name('productos.create');
    Route::post('/productos',[ProductoController::class,'store'])->name('productos.store');
    Route::get('/productos/{producto}/edit',[ProductoController::class,'edit'])->name('productos.edit');
    Route::put('/productos/{producto}',[ProductoController::class,'update'])->name('productos.update');
    Route::delete('/productos/{producto}',[ProductoController::class,'destroy'])->name('productos.destroy');
    //no seria mejor utilizar: 
    //Route::resource('productos', ProductoController::class);
    //para que quede mas limpio el codigo? (crea las rutas por defecto, las puedes ver con php artisan route:list)
});
require __DIR__.'/settings.php';
