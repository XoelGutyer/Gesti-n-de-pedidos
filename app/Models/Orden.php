<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Orden extends Model
{
    protected $table = 'ordenes';

    protected $fillable = [
        'total',
        'estado',
        'usuario_id',
        'proveedor_id',
    ];
    //
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function items()
    {
        return $this->hasMany(DetalleOrden::class);
    }
}
