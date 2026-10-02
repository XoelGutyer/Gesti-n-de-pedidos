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
Route::post('/proveedores/',[ProveedorController::class,'store'])->name('proveedores.store');
});

Route::get('/productos',[ProductoController::class,'index'])->name('productos.index');
Route::get('/productos/create',[ProductoController::class,'create'])->name('productos.create');
Route::post('/productos/',[ProductoController::class,'store'])->name('productos.store');
//Route::get('/productos/{id}',[ProductoController::class,'edit'])->name('productos.edit');
//Route::get('/productos/delete/{id}',[ProductoController::class,'destoy'])->name('productos.destroy');
require __DIR__.'/settings.php';
