<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use  HasFactory, SoftDeletes;
    
    protected $fillable = [
        'nombre',
        'direccion',
        'email',
        'dia',
        'celular',
        'user_id',
    ];

    public function  usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }
}
