<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClienteRequest;
use App\Http\Requests\UpdateClienteRequest;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\User;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ClienteController extends Controller
{
    private array $diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    public function trash(){
        $clientesBorrados = Cliente::onlyTrashed()->latest()->get();

        return Inertia::render('Papelera/Index',[
            'clientes' => $clientesBorrados,
        ]);
    }

    public function restore($id){
        $cliente = Cliente::withTrashed()->findOrFail($id);
        $cliente->restore();

        return redirect()->route('papelera.index')->with('success', 'Cliente restaurado correctamente.');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clientes = Cliente::with('usuario')->latest()->get();

        return Inertia::render('Clientes/Index',[
            'clientes' => $clientes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clientes/Create',[
            'opcionesDeDias' => array_map(fn($dia) => [
            'value' => $dia,
            'label' => ucfirst($dia), // Capitaliza la primera letra
        ], $this->diasValidos),    
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClienteRequest $request)
    {
        DB::transaction(function () use ($request) {
            $usuarioID=null;
            //verificacion por email
            if($request->filled('email')){//verifica que el formulario tenga un valor en el campo email
                $existenciaDeUsuario = User::where('email', $request->email)->first();
                if($existenciaDeUsuario){
                    $usuarioID = $existenciaDeUsuario->id;
                }
                else{
                    $usuario = User::create([
                        'name' =>$request->name,
                        'email' => $request->email,
                        'password' => Hash::make($request->contraseña),
                        'role' => 'cliente',
                    ]);
                    $usuarioID=$usuario->id;                    
                }
            }

            /*if($request->crear_usuario){
                $usuario = User::create([
                    'name' =>$request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->contraseña),
                    'role' => 'cliente',
                ]);
                $usuarioID=$usuario->id;
            }*/ //para el checkbox
            $validated = $request->validated();
            $validated['user_id'] = $usuarioID;
            Cliente::create($validated);
        });



        return redirect()
            ->route('clientes.index')
            ->with('success', 'Cliente creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cliente $cliente)
    {
        $cliente->load('usuario');
        
        $dias = array_map(fn($dia) => [
            'value' => $dia,
            'label' => ucfirst($dia), // Capitaliza la primera letra
        ], $this->diasValidos);

        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente,
            'opcionesDeDias' => $dias,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClienteRequest $request, Cliente $cliente)
    {
        $validated = $request->validated();

        $cliente->update($validated);

        return redirect()
            ->route('clientes.index')
            ->with('success', 'Cliente creado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()
            ->route('clientes.index')
            ->with('success', 'Cliente borrado correctamente.');
    }
}
