<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
    use App\Http\Controllers\Api\ProductoController;
    use App\Http\Controllers\Api\ClienteController;
    use App\Http\Controllers\Api\PedidoController;
    use App\Http\Controllers\Api\PagoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/mp/webhook', [PagoController::class, 'webhook']); 

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/cliente', [ClienteController::class, 'miCliente']);
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::middleware('auth:sanctum')->post('/pedidos/{pedido}/pagar', [PagoController::class, 'crear']);
});
