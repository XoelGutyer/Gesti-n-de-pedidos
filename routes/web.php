<?php

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
require __DIR__.'/settings.php';
