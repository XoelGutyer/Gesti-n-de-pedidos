<?php
// app/Enums/EstadoPedido.php
namespace App\Enums;

enum EstadoPedido: string
{
    case Pendiente = 'pendiente';
    case EnPreparacion = 'en_preparacion';
    case EnCamino = 'en_camino';

    public function label(): string
    {
        return match ($this) {
            self::Pendiente => 'Pendiente',
            self::EnPreparacion => 'En preparación',
            self::EnCamino => 'En camino',
        };
    }
    
    public function mensaje(): string
    {
        return match ($this) {
            self::Pendiente => 'Recibimos tu pedido y está pendiente de preparación.',
            self::EnPreparacion => 'Estamos preparando tu pedido.',
            self::EnCamino => 'Tu pedido ya salió y está en camino.',
        };
    }
}