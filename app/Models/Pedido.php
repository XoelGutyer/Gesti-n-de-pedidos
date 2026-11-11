<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Pedido extends Model
{
    protected $fillable = [
        'fecha',
        'nota',
        'cliente',
        'direccion',
        'total',
        'pagado',
        'mp_payment_id',
        'usuario_id',
        'cliente_id',
    ];

    protected $casts = [
        'fecha' => 'date',
        'pagado' => 'boolean',
    ];

    protected $appends = ['formato_fecha'];

    protected function formatoFecha() : Attribute{
        return Attribute::make(
            get: fn () => $this->fecha ? $this->fecha->format('d/m/Y') : 'sin Fecha',
        );
    }

    public function usuario(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function cliente(): BelongsTo{
        return $this->belongsTo(Cliente::class);
    }

    public function items(): HasMany{
        return $this->hasMany(DetallePedido::class);
    }

}
