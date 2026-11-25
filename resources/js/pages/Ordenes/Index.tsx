
import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, router } from "@inertiajs/react";
import {
    Eye,
    Pencil,
    Plus,
    X,
    ShoppingCart,
    Search,
    CalendarDays,
    PackageCheck,
} from "lucide-react";

interface Filtros {
    proveedor: string;
    desde: string;
    hasta: string;
    orden: string;
    direccion: string;
}

interface DetalleOrden {
    id: number;
    cantidad: number;
    costoProducto: number;
    producto_id: number;
    producto: {
        nombre: string;
    };
}

interface Orden {
    id: number;
    total: number;
    estado: string;
    proveedor: {
        nombre: string;
    };
    usuario: {
        name: string;
    };
    items: DetalleOrden[];
}

interface Props {
    ordenes: Orden[];
    proveedores: Record<number, string>;
    filtros: Filtros;
    flash?: {
        success?: string;
    };
}

const botonPrimario =
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500";

const botonContorno =
    "border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-200";

const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1);

export default function Index({
    ordenes,
    proveedores,
    filtros,
    flash,
}: Props) {
    const proveedor = filtros.proveedor ?? "";
    const desde = filtros.desde ?? "";
    const hasta = filtros.hasta ?? "";
    const orden = filtros.orden ?? "nombre";
    const direccion = filtros.direccion ?? "asc";

    const proveedorOptions = [
        { value: "", label: "Todos los proveedores" },
        ...Object.entries(proveedores)
            .map(([id, nombre]) => ({ value: id, label: nombre }))
            .sort((a, b) => a.label.localeCompare(b.label)),
    ];

    const aplicar = (cambios: Partial<Filtros> = {}) => {
        router.get(
            "/ordenes",
            { proveedor, desde, hasta, orden, direccion, ...cambios },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const ordenarPor = (campo: string) => {
        const nueva =
            orden === campo && direccion === "asc" ? "desc" : "asc";

        aplicar({ orden: campo, direccion: nueva });
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) return "";
        return direccion === "asc" ? " ↑" : " ↓";
    };

    const limpiar = () => {
        router.get(
            "/ordenes",
            { orden, direccion },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const hayFiltros = proveedor !== "" || desde !== "" || hasta !== "";

    return (
        <div className="p-6">
            <Head title="Órdenes de compra" />

            {/* Encabezado */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <ShoppingCart className="size-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Órdenes de compra
                        </h1>

                        <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                            {ordenes.length} orden(es) registradas
                        </p>
                    </div>
                </div>

                <Button className={botonPrimario} asChild>
                    <Link href="/ordenes/create">
                        <Plus />
                        Nueva orden
                    </Link>
                </Button>
            </div>

            {/* Mensaje de éxito */}
            {flash?.success && (
                <div
                    className="relative mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                    role="alert"
                >
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Filtros */}
            <div className="mb-5 rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                <div className="mb-3 flex items-center gap-2">
                    <Search className="size-4 text-blue-500" />
                    <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Filtrar órdenes
                    </h2>
                </div>

                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-full sm:w-64">
                        <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400">
                            Proveedor
                        </label>

                        <Combobox
                            options={proveedorOptions}
                            value={proveedor}
                            onChange={(v) => aplicar({ proveedor: v })}
                            placeholder="Todos los proveedores"
                            searchPlaceholder="Buscar proveedor..."
                            emptyText="No se encontraron proveedores."
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <CalendarDays className="size-3.5 text-blue-400" />
                            Desde
                        </label>

                        <Input
                            type="date"
                            value={desde}
                            max={hasta || undefined}
                            onChange={(e) =>
                                aplicar({ desde: e.target.value })
                            }
                            className="w-full border-blue-200 dark:border-blue-900 sm:w-44"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <CalendarDays className="size-3.5 text-blue-400" />
                            Hasta
                        </label>

                        <Input
                            type="date"
                            value={hasta}
                            min={desde || undefined}
                            onChange={(e) =>
                                aplicar({ hasta: e.target.value })
                            }
                            className="w-full border-blue-200 dark:border-blue-900 sm:w-44"
                        />
                    </div>

                    {hayFiltros && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={limpiar}
                            className={botonContorno}
                        >
                            <X className="size-4" />
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-blue-100 bg-blue-600 dark:border-blue-900/50 dark:bg-blue-900/70">
                                <th className="px-5 py-4 font-semibold text-white">
                                    ID
                                </th>

                                <th
                                    className="cursor-pointer px-5 py-4 font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
                                    onClick={() => ordenarPor("nombre")}
                                >
                                    Proveedor{indicadorOrden("nombre")}
                                </th>

                                <th
                                    className="cursor-pointer px-5 py-4 font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
                                    onClick={() => ordenarPor("estado")}
                                >
                                    Estado{indicadorOrden("estado")}
                                </th>

                                <th
                                    className="cursor-pointer px-5 py-4 font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
                                    onClick={() => ordenarPor("total")}
                                >
                                    Total{indicadorOrden("total")}
                                </th>

                                <th className="px-5 py-4 text-right font-semibold text-white">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {ordenes.length > 0 ? (
                                ordenes.map((o) => (
                                    <tr
                                        key={o.id}
                                        className="group border-b border-blue-50 transition-colors last:border-b-0 hover:bg-blue-50/70 dark:border-slate-800 dark:hover:bg-blue-950/40"
                                    >
                                        <td className="px-5 py-4 font-semibold text-blue-700 dark:text-blue-300">
                                            #{o.id}
                                        </td>

                                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                                            {o.proveedor.nombre}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                    o.estado === "solicitado"
                                                        ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                                                        : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                                }`}
                                            >
                                                {o.estado !== "solicitado" && (
                                                    <PackageCheck className="size-3" />
                                                )}
                                                {capitalize(o.estado)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                                            ${Number(o.total).toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {o.estado === "solicitado" ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                        className={botonContorno}
                                                    >
                                                        <Link
                                                            href={`/ordenes/${o.id}/edit`}
                                                        >
                                                            <Pencil className="size-4" />
                                                            Recibir pedido
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                        className={botonContorno}
                                                    >
                                                        <Link
                                                            href={`/ordenes/${o.id}`}
                                                        >
                                                            <Eye className="size-4" />
                                                            Ver detalle
                                                        </Link>
                                                    </Button>
                                                )}
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
                                        <ShoppingCart className="mx-auto mb-2 size-8 text-blue-300 dark:text-blue-800" />

                                        {hayFiltros
                                            ? "No se encontraron órdenes con los filtros seleccionados."
                                            : "No hay órdenes registradas."}
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
