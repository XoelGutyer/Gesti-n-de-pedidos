import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import { Plus } from "lucide-react";

interface Proveedor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
}

interface Props {
    proveedores: Proveedor[];
}

export default function Index({ proveedores }: Props) {
    return (
        <>
            <Head title="Proveedores" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Proveedores
                    </h1>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Lista de proveedores registrados en el sistema.
                    </p>

                    <Button asChild>
                        <Link href="/proveedores/create">
                            <Plus />
                            Nuevo proveedor
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                        ID
                                    </th>

                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                        Nombre
                                    </th>

                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                        Teléfono
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {proveedores.length > 0 ? (
                                    proveedores.map((proveedor) => (
                                        <tr
                                            key={proveedor.id}
                                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                        >
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {proveedor.id}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {proveedor.nombre}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {proveedor.email}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {proveedor.telefono}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No hay proveedores registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
