<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Producto::create([
            'nombre' => 'Producto de prueba 1',
            'precio' => 1500,
            'costo' => 900,
            'stock' => 20,
            'proveedor_id' => 1,
        ]);
        Producto::create([
            'nombre' => 'Producto de prueba 2',
            'precio' => 1500,
            'costo' => 900,
            'stock' => 20,
            'proveedor_id' => 1,
        ]);
        Producto::create([
            'nombre' => 'Producto de prueba 3',
            'precio' => 1500,
            'costo' => 900,
            'stock' => 20,
            'proveedor_id' => 2,
        ]);
        Producto::create([
            'nombre' => 'Producto de prueba 4',
            'precio' => 1500,
            'costo' => 900,
            'stock' => 20,
            'proveedor_id' => 2,
        ]);
        Producto::create([
            'nombre' => 'Producto de prueba 5',
            'precio' => 1500,
            'costo' => 900,
            'stock' => 20,
            'proveedor_id' => 3,
        ]);
    }
}
