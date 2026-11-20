<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class ProductoFactory extends Factory
{
    public function definition(): array
    {
        $costo = fake()->numberBetween(500, 30000);

        return [
            'nombre'       => ucfirst(fake()->words(3, true)),
            'costo'        => $costo,
            'precio'       => (int) round($costo * 1.4), // 40% de ganancia
            'stock'        => fake()->numberBetween(0, 100),
            'proveedor_id' => fake()->numberBetween(1, 3),
            'imagen'       => $this->imagenAleatoria(),
        ];
    }

    private function imagenAleatoria(): ?string
    {
        $archivos = glob(
            database_path('seeders/images/*.{jpg,jpeg,png,webp}'),
            GLOB_BRACE
        );

        if (empty($archivos)) {
            return null;
        }

        $elegido = fake()->randomElement($archivos);
        $destino = 'productos/' . basename($elegido);

        Storage::disk('public')->put($destino, file_get_contents($elegido));

        return $destino;
    }
}