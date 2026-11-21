import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, router } from "@inertiajs/react";
import { Eye, Pencil, Plus, X } from "lucide-react";

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

export default function Index({ ordenes, proveedores, filtros, flash }: Props) {
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

    const aplicar = (
        cambios: Partial<Filtros> = {},
    ) => {
        router.get(
            "/ordenes",
            { proveedor, desde, hasta, orden, direccion, ...cambios },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const ordenarPor = (campo: string) => {
        const nueva = orden === campo && direccion === "asc" ? "desc" : "asc";
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
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const hayFiltros = proveedor !== "" || desde !== "" || hasta !== "";

    return (
        <div className="p-6">
            <Head title="Ordenes" />
            <div className="mb-6 flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-white">Ordenes de compra</h1>

                <Button asChild>
                    <Link href="/ordenes/create">
                        <Plus />
                        Nueva orden
                    </Link>
                </Button>
            </div>

            {flash?.success && (
                <div
                    className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                    role="alert"
                >
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            {/* Filtros */}
            <div className="mb-4 flex flex-wrap items-end gap-3">
                <div className="w-64">
                    <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
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
                    <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                        Desde
                    </label>
                    <Input
                        type="date"
                        value={desde}
                        max={hasta || undefined}
                        onChange={(e) => aplicar({ desde: e.target.value })}
                        className="w-44"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                        Hasta
                    </label>
                    <Input
                        type="date"
                        value={hasta}
                        min={desde || undefined}
                        onChange={(e) => aplicar({ hasta: e.target.value })}
                        className="w-44"
                    />
                </div>

                {hayFiltros && (
                    <Button type="button" variant="ghost" size="sm" onClick={limpiar}>
                        <X />
                        Limpiar filtros
                    </Button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">ID</th>
                                <th
                                    className="cursor-pointer px-6 py-4 font-semibold text-gray-700 dark:text-gray-200"
                                    onClick={() => ordenarPor("nombre")}
                                >
                                    Proveedor{indicadorOrden("nombre")}
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-4 font-semibold text-gray-700 dark:text-gray-200"
                                    onClick={() => ordenarPor("estado")}
                                >
                                    Estado{indicadorOrden("estado")}
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-4 font-semibold text-gray-700 dark:text-gray-200"
                                    onClick={() => ordenarPor("total")}
                                >
                                    Total{indicadorOrden("total")}
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ordenes.length > 0 ? (
                                ordenes.map((o) => (
                                    <tr
                                        key={o.id}
                                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{o.id}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {o.proveedor.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{o.estado}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            ${Number(o.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/ordenes/${o.id}`}>
                                                        <Eye /> Ver detalle
                                                    </Link>
                                                </Button>
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/ordenes/${o.id}/editar-items`}>
                                                        <Pencil /> Editar ítems
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No hay órdenes registradas.
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