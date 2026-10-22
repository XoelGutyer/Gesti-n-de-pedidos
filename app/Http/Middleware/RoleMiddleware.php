<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(
        Request $request,
        Closure $next,
        string ...$roles
    ): Response {
        $user = $request->user();

        // Verificar que exista un usuario autenticado
        if (! $user) {
            abort(401);
        }

        // Verificar si su rol está permitido
        if (! in_array($user->role, $roles, true)) {
            abort(403, 'No tenés permiso para acceder a esta sección.');
        }

        // Si cumple las condiciones, continúa
        return $next($request);
    }
}
