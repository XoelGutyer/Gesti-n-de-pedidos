<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'cliente',
            'email' => 'cliente@test.com',
        ]);
        User::factory()->create([
            'name' => 'preventista',
            'email' => 'preventista@test.com',
            'role' => 'preventista'
        ]);
        User::factory()->create([
            'name' => 'administrador',
            'email' => 'admin@test.com',
            'role' => 'admin'
        ]);

        $this->call([
            ProveedorSeeder::class,
            ProductoSeeder::class,
        ]);
    }
}
