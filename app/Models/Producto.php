<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    //
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
}
