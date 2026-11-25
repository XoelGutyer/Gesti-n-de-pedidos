import { Button } from "@/components/ui/button";
import { Head, Link, router } from "@inertiajs/react";
import {
    CalendarDays,
    Mail,
    Pencil,
    Phone,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";

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

// Estilos reutilizables (paleta azul)
const botonPrimario =
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500";
const botonContorno =
    "border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 " +
    "dark:border-blue-800 dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-200";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Index({ clientes }: Props) {
    const [busqueda, setBusqueda] = useState("");

    const clientesFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();
        if (!termino) return clientes;

        return clientes.filter(
            (cliente) =>
                cliente.nombre.toLowerCase().includes(termino) ||
                cliente.email.toLowerCase().includes(termino),
        );
    }, [clientes, busqueda]);

    const eliminar = (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            router.delete(`/clientes/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="p-6">
            <Head title="Clientes" />

            {/* Encabezado */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <Users className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Clientes
                        </h1>
                        <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                            {clientes.length} cliente(s) registrados
                        </p>
                    </div>
                </div>

                <Button className={botonPrimario} asChild>
                    <Link href="/clientes/create">
                        <Plus />
                        Nuevo cliente
                    </Link>
                </Button>
            </div>

            {/* Buscador */}
            <div className="relative mb-4 max-w-sm">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-blue-400" />
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o correo..."
                    className="w-full rounded-lg border border-blue-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-blue-100 bg-blue-600 dark:border-blue-900/50 dark:bg-blue-900/70">
                                {[
                                    "ID",
                                    "Nombre",
                                    "Dirección",
                                    "Contacto",
                                    "Día",
                                    "Usuario",
                                ].map((t) => (
                                    <th
                                        key={t}
                                        className="px-4 py-4 font-semibold text-white"
                                    >
                                        {t}
                                    </th>
                                ))}
                                <th className="sticky right-0 bg-blue-600 px-4 py-4 text-right font-semibold text-white dark:bg-blue-900">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {clientesFiltrados.length > 0 ? (
                                clientesFiltrados.map((cliente) => (
                                    <tr
                                        key={cliente.id}
                                        className="group border-b border-blue-50 transition-colors last:border-b-0 hover:bg-blue-50/70 dark:border-slate-800 dark:hover:bg-blue-950/40"
                                    >
                                        <td className="px-4 py-3 font-semibold text-blue-700 dark:text-blue-300">
                                            #{cliente.id}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                            {cliente.nombre}
                                        </td>
                                        <td
                                            className="max-w-[220px] truncate px-4 py-3 text-slate-600 dark:text-slate-400"
                                            title={cliente.direccion}
                                        >
                                            {cliente.direccion}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="size-3.5 text-blue-400" />
                                                {cliente.email}
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                                <Phone className="size-3.5 text-blue-400" />
                                                {cliente.celular}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {cliente.dia ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                                    <CalendarDays className="size-3" />
                                                    {capitalize(cliente.dia)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                            {cliente.usuario
                                                ? cliente.usuario.name
                                                : "—"}
                                        </td>
                                        <td className="sticky right-0 bg-white px-4 py-3 group-hover:bg-blue-50 dark:bg-slate-900 dark:group-hover:bg-blue-950">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="outline"
                                                    className={botonContorno}
                                                    title="Editar"
                                                    aria-label="Editar"
                                                >
                                                    <Link
                                                        href={`/clientes/${cliente.id}/edit`}
                                                    >
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="border-red-200 hover:bg-red-50 dark:border-red-900 dark:bg-transparent dark:hover:bg-red-950"
                                                    title="Eliminar"
                                                    aria-label="Eliminar"
                                                    onClick={() =>
                                                        eliminar(cliente.id)
                                                    }
                                                >
                                                    <Trash2 className="text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        <Users className="mx-auto mb-2 size-8 text-blue-300 dark:text-blue-800" />
                                        {busqueda
                                            ? "No se encontraron clientes con esa búsqueda."
                                            : "No hay clientes registrados."}
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