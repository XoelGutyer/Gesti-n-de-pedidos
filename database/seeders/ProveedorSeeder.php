<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Proveedor;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Proveedor::create([
            'nombre' => 'Coca Cola S.A.',
            'telefono' => '3815551234',
            'email' => 'cocacola@example.com',
        ]);

        Proveedor::create([
            'nombre' => 'Mayorista Norte',
            'telefono' => '3815555678',
            'email' => 'norte@example.com',
        ]);
        Proveedor::create([
            'nombre' => 'Pepsi S.A.',
            'telefono' => '3815555678',
            'email' => 'pepsi@example.com',
        ]);
        
    }
}
