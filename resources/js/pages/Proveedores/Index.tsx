import { Button } from "@/components/ui/button";
import { Head, Link, router } from "@inertiajs/react";
import { Mail, Pencil, Phone, Plus, Trash2, Truck } from "lucide-react";

interface Proveedor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
}

interface Props {
    proveedores: Proveedor[];
}

// Estilos reutilizables (paleta azul)
const botonPrimario =
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500";
const botonContorno =
    "border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 " +
    "dark:border-blue-800 dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-200";

export default function Index({ proveedores }: Props) {
    const eliminar = (p: Proveedor) => {
        if (confirm(`¿Está seguro de eliminar a "${p.nombre}"?`)) {
            router.delete(`/proveedores/${p.id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Proveedores" />

            <div className="p-6">
                {/* Encabezado */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <Truck className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Proveedores
                            </h1>
                            <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                                Lista de proveedores registrados en el sistema.
                            </p>
                        </div>
                    </div>

                    <Button className={botonPrimario} asChild>
                        <Link href="/proveedores/create">
                            <Plus />
                            Nuevo proveedor
                        </Link>
                    </Button>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-blue-100 bg-blue-600 dark:border-blue-900/50 dark:bg-blue-900/70">
                                <tr>
                                    {[
                                        "ID",
                                        "Nombre",
                                        "Email",
                                        "Teléfono",
                                        "Acciones",
                                    ].map((t) => (
                                        <th
                                            key={t}
                                            className="px-6 py-4 font-semibold text-white"
                                        >
                                            {t}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {proveedores.length > 0 ? (
                                    proveedores.map((proveedor) => (
                                        <tr
                                            key={proveedor.id}
                                            className="border-b border-blue-50 transition-colors last:border-b-0 hover:bg-blue-50/70 dark:border-slate-800 dark:hover:bg-blue-950/40"
                                        >
                                            <td className="px-6 py-4 font-semibold text-blue-700 dark:text-blue-300">
                                                #{proveedor.id}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {proveedor.nombre}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                <span className="inline-flex items-center gap-2">
                                                    <Mail className="size-4 text-blue-400" />
                                                    {proveedor.email}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                <span className="inline-flex items-center gap-2">
                                                    <Phone className="size-4 text-blue-400" />
                                                    {proveedor.telefono}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className={botonContorno}
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/proveedores/${proveedor.id}/edit`}
                                                        >
                                                            <Pencil />
                                                            Editar
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950"
                                                        onClick={() =>
                                                            eliminar(proveedor)
                                                        }
                                                    >
                                                        <Trash2 />
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            <Truck className="mx-auto mb-2 size-8 text-blue-300 dark:text-blue-800" />
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