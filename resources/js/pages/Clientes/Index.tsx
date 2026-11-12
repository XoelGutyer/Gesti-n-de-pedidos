import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface Usuario {
    id: number;
    name: string;
}

interface Cliente {
    id: number;
    nombre: string;
    direccion: string;
    email: string;
    dia: string;
    celular: string;
    usuario: Usuario | null;
}

interface Props {
    clientes: Cliente[];
}

export default function Index({ clientes }: Props) {
    const eliminar = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            router.delete(`/clientes/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="p-6">
            <Head title="Clientes" />

            <div className="mb-6 flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
                    <h4 className="mt-1 text-sm text-gray-600 dark:text-gray-400">Lista de clientes</h4>
                </div>

                <Button asChild>
                    <Link href="/clientes/create">
                        <Plus />
                        Nuevo cliente
                    </Link>
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">ID</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Nombre</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Dirección</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Contacto</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Día</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Usuario</th>
                                <th className="sticky right-0 bg-gray-50 px-4 py-3 text-right font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => (
                                    <tr
                                        key={cliente.id}
                                        className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{cliente.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                            {cliente.nombre}
                                        </td>
                                        <td
                                            className="max-w-[220px] truncate px-4 py-3 text-gray-600 dark:text-gray-400"
                                            title={cliente.direccion}
                                        >
                                            {cliente.direccion}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                            <div>{cliente.email}</div>
                                            <div className="text-xs text-gray-500">{cliente.celular}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{cliente.dia}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                            {cliente.usuario ? cliente.usuario.name : '-'}
                                        </td>
                                        <td className="sticky right-0 bg-white px-4 py-3 group-hover:bg-gray-50 dark:bg-gray-900 dark:group-hover:bg-gray-800">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild size="icon" variant="outline" title="Editar" aria-label="Editar">
                                                    <Link href={`/clientes/${cliente.id}/edit`}>
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    title="Eliminar"
                                                    aria-label="Eliminar"
                                                    onClick={() => eliminar(cliente.id)}
                                                >
                                                    <Trash2 className="text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No hay clientes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}