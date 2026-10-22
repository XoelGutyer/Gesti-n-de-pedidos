
import { Head, Link, useForm } from '@inertiajs/react';

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
};

function RoleEditor({
    userId,
    role,
}: {
    userId: number;
    role: Role;
}) {
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
                    onChange={(event) =>
                        setData('role', event.target.value as Role)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing ? 'Guardando...' : 'Guardar'}
                </button>
            </div>

            {errors.role && (
                <p className="text-sm text-red-600">{errors.role}</p>
            )}
        </div>
    );
}

export default function UsuariosIndex({ users }: Props) {
    return (
        <>
            <Head title="Administración de usuarios" />

            <div className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8 dark:bg-gray-950 dark:text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">
                            Administración de usuarios
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Consultá los usuarios registrados y administrá
                            sus permisos.
                        </p>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-sm text-gray-500">
                                Usuarios registrados
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                                {users.total}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-sm text-gray-500">
                                Página actual
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                                {users.current_page} de {users.last_page}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-sm text-gray-500">
                                Registros por página
                            </p>
                            <p className="mt-1 text-3xl font-bold">15</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    <tr>
                                        <th className="px-5 py-4">ID</th>
                                        <th className="px-5 py-4">Usuario</th>
                                        <th className="px-5 py-4">Correo</th>
                                        <th className="px-5 py-4">Rol actual</th>
                                        <th className="min-w-72 px-5 py-4">
                                            Cambiar rol
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                        >
                                            <td className="px-5 py-4">
                                                {user.id}
                                            </td>

                                            <td className="px-5 py-4 font-medium">
                                                {user.name}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                {user.email}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                                            : user.role === 'preventista'
                                                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                              : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                                    }`}
                                                >
                                                    {user.role === 'admin'
                                                        ? 'Administrador'
                                                        : user.role ===
                                                            'preventista'
                                                          ? 'Preventista'
                                                          : 'Cliente'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <RoleEditor
                                                    userId={user.id}
                                                    role={user.role}
                                                />
                                            </td>
                                        </tr>
                                    ))}

                                    {users.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-5 py-10 text-center text-gray-500"
                                            >
                                                No hay usuarios registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
                            <p className="text-sm text-gray-500">
                                Página {users.current_page} de {users.last_page}
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {users.links.map((link, index) => (
                                    <span key={`${index}-${link.label}`}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                preserveScroll
                                                className={`inline-flex rounded-lg px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                className="inline-flex cursor-not-allowed rounded-lg px-3 py-2 text-sm text-gray-400"
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
