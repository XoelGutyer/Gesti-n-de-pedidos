<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetallePedido extends Model
{
    protected $table = 'detalle_pedido';

    protected $fillable = [
        'cantidad',
        'precioProducto',
        'costoProducto',
        'subtotal',
        'producto_id',
        'pedido_id',
    ];

    public function pedido(): BelongsTo{
        return $this->belongsTo(Pedido::class);
    }

    public function producto(): BelongsTo{
        return $this->belongsTo(Producto::class);
    }    
}
