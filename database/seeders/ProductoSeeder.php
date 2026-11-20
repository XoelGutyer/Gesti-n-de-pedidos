<?php

namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        // Limpia las imágenes de corridas anteriores
        Storage::disk('public')->deleteDirectory('productos');

        Producto::factory()->count(50)->create();
    }
}