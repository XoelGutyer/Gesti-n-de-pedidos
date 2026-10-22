<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->role === 'admin', 403);

        $users = User::query()
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Usuarios/index', [
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->role === 'admin', 403);
        
        //aca nomas hacemos la validacion de que el rol sea uno de los permitidos
        $validated = $request->validate([
            'role' => ['required', 'in:admin,preventista,cliente'],
        ]);

        if (
            $request->user()->id === $user->id &&
            $validated['role'] !== 'admin'
        ) {
            return back()->withErrors([
                'role' => 'No podés quitarte tu propio rol de administrador.',
            ]);
        }

        $user->role = $validated['role'];
        $user->save();

        return back()->with('success', 'Rol actualizado correctamente.');
    }
    
}
