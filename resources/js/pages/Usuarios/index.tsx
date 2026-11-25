import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, ShieldCheck, Users, X } from 'lucide-react';
import type { FormEvent } from 'react';

type Role = 'admin' | 'preventista' | 'cliente';

type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    users: {
        data: User[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        buscar: string;
    };
};

const ROLES: Record<Role, { label: string; clase: string }> = {
    admin: {
        label: 'Administrador',
        clase: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    },
    preventista: {
        label: 'Preventista',
        clase: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    cliente: {
        label: 'Cliente',
        clase: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    },
};

const tarjeta = 'rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900';

function RoleEditor({ userId, role }: { userId: number; role: Role }) {
    const { data, setData, patch, processing, errors } = useForm<{
        role: Role;
    }>({
        role,
    });

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <select
                    value={data.role}
                    onChange={(event) => setData('role', event.target.value as Role)}
                    className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-blue-900 dark:bg-slate-900 dark:text-white"
                >
                    <option value="admin">Administrador</option>
                    <option value="preventista">Preventista</option>
                    <option value="cliente">Cliente</option>
                </select>

                <button
                    type="button"
                    disabled={processing || data.role === role}
                    onClick={() =>
                        patch(`/usuarios/${userId}/rol`, {
                            preserveScroll: true,
                        })
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-500"
                >
                    {processing ? 'Guardando...' : 'Guardar'}
                </button>
            </div>

            {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
        </div>
    );
}

export default function UsuariosIndex({ users, filters }: Props) {
    const { data, setData } = useForm({
        buscar: filters.buscar ?? '',
    });

    const buscarUsuarios = (event: FormEvent) => {
        event.preventDefault();

        router.get('/usuarios', data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Administración de usuarios" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Encabezado */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <ShieldCheck className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Administración de usuarios
                            </h1>
                            <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                                Consultá los usuarios registrados y administrá sus permisos.
                            </p>
                        </div>
                    </div>

                    {/* Buscador */}
                    <form
                        onSubmit={buscarUsuarios}
                        className="mb-5 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:flex-row dark:border-blue-900/50 dark:bg-blue-950/30"
                    >
                        <div className="relative w-full">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-blue-400" />
                            <input
                                type="text"
                                value={data.buscar}
                                onChange={(e) => setData('buscar', e.target.value)}
                                placeholder="Buscar por usuario o correo electrónico..."
                                className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pr-4 pl-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-blue-900 dark:bg-slate-900 dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:hover:bg-blue-500"
                        >
                            <Search className="size-4" />
                            Buscar
                        </button>

                        {filters.buscar && (
                            <button
                                type="button"
                                onClick={() => {
                                    setData('buscar', '');
                                    router.get(
                                        '/usuarios',
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-6 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                            >
                                <X className="size-4" />
                                Limpiar
                            </button>
                        )}
                    </form>

                    {/* Indicadores */}
                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-blue-600 bg-gradient-to-br from-blue-700 to-blue-500 p-5 text-white shadow-md dark:border-blue-700">
                            <p className="flex items-center gap-2 text-sm text-blue-100">
                                <Users className="size-4" />
                                Usuarios registrados
                            </p>
                            <p className="mt-1 text-3xl font-bold tabular-nums">{users.total}</p>
                        </div>

                        <div className={tarjeta}>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Página actual</p>
                            <p className="mt-1 text-3xl font-bold text-blue-950 tabular-nums dark:text-white">
                                {users.current_page} de {users.last_page}
                            </p>
                        </div>

                        <div className={tarjeta}>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Registros por página</p>
                            <p className="mt-1 text-3xl font-bold text-blue-950 tabular-nums dark:text-white">15</p>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-blue-600 text-white dark:bg-blue-900/70">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">ID</th>
                                        <th className="px-5 py-4 font-semibold">Usuario</th>
                                        <th className="px-5 py-4 font-semibold">Correo</th>
                                        <th className="px-5 py-4 font-semibold">Rol actual</th>
                                        <th className="min-w-72 px-5 py-4 font-semibold">Cambiar rol</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-blue-50/70 dark:hover:bg-blue-950/40"
                                        >
                                            <td className="px-5 py-4 font-semibold text-blue-700 dark:text-blue-300">
                                                #{user.id}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                                                {user.name}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                                                {user.email}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ROLES[user.role].clase}`}
                                                >
                                                    {ROLES[user.role].label}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <RoleEditor userId={user.id} role={user.role} />
                                            </td>
                                        </tr>
                                    ))}

                                    {users.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-5 py-12 text-center text-slate-500 dark:text-slate-400"
                                            >
                                                <Users className="mx-auto mb-2 size-8 text-blue-300 dark:text-blue-800" />
                                                No hay usuarios registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 bg-blue-50/60 px-5 py-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Página {users.current_page} de {users.last_page}
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {users.links.map((link, index) => (
                                    <span key={`${index}-${link.label}`}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                preserveScroll
                                                className={`inline-flex rounded-lg px-3 py-2 text-sm transition ${
                                                    link.active
                                                        ? 'bg-blue-600 font-semibold text-white shadow-sm'
                                                        : 'border border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950'
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                className="inline-flex cursor-not-allowed rounded-lg px-3 py-2 text-sm text-slate-400"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}