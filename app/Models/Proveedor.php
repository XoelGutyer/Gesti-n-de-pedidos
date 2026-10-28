<?php

namespace App\Models;

use App\Models\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proveedor extends Model
{
    //
     protected $table = 'proveedores';

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'activo',
    ];

public function productos(): HasMany
{
    return $this->hasMany(Producto::class);//, 'proveedor_id'
}
}
