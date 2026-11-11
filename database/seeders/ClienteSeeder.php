<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        $dias = ['lunes', 'miercoles', 'viernes'];

        // 15 usuarios
        $users = User::factory()->count(15)->create();

        // 15 clientes, uno por usuario, repartidos 5 por día (L, M, V, L, M, V...)
        $users->each(function (User $user, int $i) use ($dias) {
            Cliente::factory()->create([
                'user_id' => $user->id,
                'nombre'  => $user->name,
                'email'   => $user->email,
                'dia'     => $dias[$i % 3],
            ]);
        });
    }
}