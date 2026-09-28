<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            
            $table->date('fecha');
            $table->string('nota');
    //se agraga cliente y direccion para no depender de cliente_id para mostrar los campos
            $table->string('cliente');
            $table->string('direccion');
            
            $table->decimal('total',10,2);
            $table->boolean('pagado')->default(false);

            $table->foreignId('usuario_id')->constrained('users');
            $table->foreignId('cliente_id')->constrained('clientes');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
