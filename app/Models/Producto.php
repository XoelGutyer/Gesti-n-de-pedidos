<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Producto extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'precio',
        'costo',
        'stock',
        'imagen',
        'activo',
        'descuento',
        'proveedor_id',
    ];

    public function proveedor(){
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function detalleOrdenes()
    {
        return $this->hasMany(DetalleOrden::class, 'producto_id');
    }
}
