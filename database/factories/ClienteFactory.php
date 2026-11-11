<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClienteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'    => fake()->name(),
            'direccion' => fake()->address(),
            'email'     => fake()->unique()->safeEmail(),
            'dia'       => fake()->randomElement(['lunes', 'miercoles', 'viernes']),
            'celular'   => fake()->phoneNumber(),
            'user_id'   => null,
        ];
    }
}