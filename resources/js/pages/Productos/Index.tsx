import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Combobox } from "@/components/combobox";

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    descuento?: number | string | null;
    costo: number;
    stock: number;
    imagen: string | null;
    proveedor: {
        nombre: string;
    };
}

interface ProductosPaginados {
    data: Producto[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Filtros {
    buscar: string;
    proveedor: string;
    orden: string;
    direccion: string;
    por_pagina: number;
}

interface Props {
    productos: ProductosPaginados;
    proveedores: Record<number, string>;
    filtros: Filtros;
    flash?: {
        success?: string;
    };
}

const peso = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

// Estilos reutilizables (paleta azul)
const botonPrimario =
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500";
const botonContorno =
    "border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 " +
    "dark:border-blue-800 dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-200";
const selectClase =
    "rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 " +
    "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 " +
    "dark:border-blue-900 dark:bg-slate-900 dark:text-white";

function Ordenable({
    campo,
    orden,
    direccion,
    onClick,
    children,
}: {
    campo: string;
    orden: string;
    direccion: string;
    onClick: (campo: string) => void;
    children: ReactNode;
}) {
    const Icono =
        orden !== campo
            ? ArrowUpDown
            : direccion === "asc"
              ? ArrowUp
              : ArrowDown;

    return (
        <th className="px-4 py-4 font-semibold text-white">
            <button
                type="button"
                onClick={() => onClick(campo)}
                className="flex items-center gap-1.5 transition hover:text-blue-100"
            >
                {children}
                <Icono
                    className={`size-3.5 ${orden === campo ? "" : "text-blue-200"}`}
                />
            </button>
        </th>
    );
}

export default function Index({
    productos,
    proveedores,
    filtros,
    flash,
}: Props) {
    // Lo que viene del servidor es la fuente de verdad; solo el buscador necesita estado propio
    const [buscar, setBuscar] = useState(filtros.buscar ?? "");
    const proveedor = filtros.proveedor ?? "";
    const orden = filtros.orden ?? "nombre";
    const direccion = filtros.direccion ?? "asc";
    const porPagina = filtros.por_pagina ?? 5;

    const aplicar = (
        cambios: Partial<{
            buscar: string;
            proveedor: string;
            orden: string;
            direccion: string;
            por_pagina: number;
        }> = {},
    ) => {
        router.get(
            "/productos",
            {
                buscar,
                proveedor,
                orden,
                direccion,
                por_pagina: porPagina,
                ...cambios,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const buscarProductos = (e: FormEvent) => {
        e.preventDefault();
        aplicar();
    };

    const ordenarPor = (campo: string) => {
        const nueva = orden === campo && direccion === "asc" ? "desc" : "asc";
        aplicar({ orden: campo, direccion: nueva });
    };

    const limpiar = () => {
        setBuscar("");
        router.get(
            "/productos",
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const irA = (url: string | null) => {
        if (url)
            router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    const eliminar = (p: Producto) => {
        if (confirm(`¿Está seguro de eliminar "${p.nombre}"?`)) {
            router.delete(`/productos/${p.id}`, { preserveScroll: true });
        }
    };

    const hayFiltros = buscar !== "" || proveedor !== "";

    const proveedorOptions = [
        { value: "", label: "Todos los proveedores" },
        ...Object.entries(proveedores)
            .map(([id, nombre]) => ({ value: id, label: nombre }))
            .sort((a, b) => a.label.localeCompare(b.label)),
    ];

    return (
        <div className="p-6">
            <Head title="Productos" />

            {/* Encabezado */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <Package className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Productos
                        </h1>
                        <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                            Lista de productos registrados en el sistema.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        className={botonContorno}
                        asChild
                    >
                        <a
                            href="/catalogo/pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FileText />
                            Catálogo PDF
                        </a>
                    </Button>
                    <Button className={botonPrimario} asChild>
                        <Link href="/productos/create">
                            <Plus />
                            Nuevo producto
                        </Link>
                    </Button>
                </div>
            </div>

            {flash?.success && (
                <div
                    className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    role="alert"
                >
                    {flash.success}
                </div>
            )}

            {/* Filtros */}
            <form
                onSubmit={buscarProductos}
                className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/30"
            >
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        placeholder="Buscar producto"
                        className="w-56 border-blue-200 bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/30 dark:border-blue-900 dark:bg-slate-900"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className={botonPrimario}
                        title="Buscar"
                        aria-label="Buscar"
                    >
                        <Search />
                    </Button>
                </div>

                <div className="w-64">
                    <Combobox
                        options={proveedorOptions}
                        value={proveedor}
                        onChange={(v) => aplicar({ proveedor: v })}
                        placeholder="Todos los proveedores"
                        searchPlaceholder="Buscar proveedor..."
                        emptyText="No se encontraron proveedores."
                    />
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
                    Mostrar
                    <select
                        className={selectClase}
                        value={porPagina}
                        onChange={(e) =>
                            aplicar({ por_pagina: Number(e.target.value) })
                        }
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    filas
                </label>

                {hayFiltros && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                        onClick={limpiar}
                    >
                        <X />
                        Limpiar filtros
                    </Button>
                )}
            </form>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-blue-100 bg-blue-600 dark:border-blue-900/50 dark:bg-blue-900/70">
                                <th className="px-4 py-4 font-semibold text-white">
                                    Imagen
                                </th>
                                <Ordenable
                                    campo="nombre"
                                    orden={orden}
                                    direccion={direccion}
                                    onClick={ordenarPor}
                                >
                                    Nombre
                                </Ordenable>
                                <Ordenable
                                    campo="precio"
                                    orden={orden}
                                    direccion={direccion}
                                    onClick={ordenarPor}
                                >
                                    Precio
                                </Ordenable>
                                <th className="px-4 py-4 font-semibold text-white">
                                    Desc.
                                </th>
                                <th className="px-4 py-4 font-semibold text-white">
                                    Stock
                                </th>
                                <th className="px-4 py-4 font-semibold text-white">
                                    Proveedor
                                </th>
                                <th className="sticky right-0 bg-blue-600 px-4 py-4 text-right font-semibold text-white dark:bg-blue-900">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {productos.data.length > 0 ? (
                                productos.data.map((producto) => {
                                    const desc = Number(
                                        producto.descuento ?? 0,
                                    );

                                    return (
                                        <tr
                                            key={producto.id}
                                            className="group border-b border-blue-50 transition-colors last:border-b-0 hover:bg-blue-50/70 dark:border-slate-800 dark:hover:bg-blue-950/40"
                                        >
                                            <td className="px-4 py-3">
                                                {producto.imagen ? (
                                                    <img
                                                        src={`/storage/${producto.imagen}`}
                                                        alt={producto.nombre}
                                                        loading="lazy"
                                                        className="size-12 rounded-lg object-cover ring-1 ring-blue-100 dark:ring-blue-900"
                                                    />
                                                ) : (
                                                    <div className="flex size-12 items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 text-blue-300 dark:border-blue-900 dark:bg-slate-800 dark:text-blue-800">
                                                        <Package className="size-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                {producto.nombre}
                                            </td>
                                            <td className="px-4 py-3 font-semibold tabular-nums text-blue-700 dark:text-blue-300">
                                                {peso.format(
                                                    Number(producto.precio),
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {desc > 0 ? (
                                                    <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                                        -{desc}%
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        producto.stock === 0
                                                            ? "destructive"
                                                            : "outline"
                                                    }
                                                    className={
                                                        producto.stock === 0
                                                            ? ""
                                                            : producto.stock <=
                                                                10
                                                              ? "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                              : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                                                    }
                                                >
                                                    {producto.stock}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                {producto.proveedor.nombre}
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
                                                            href={`/productos/${producto.id}/edit`}
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
                                                            eliminar(producto)
                                                        }
                                                    >
                                                        <Trash2 className="text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        <Package className="mx-auto mb-2 size-8 text-blue-300 dark:text-blue-800" />
                                        No hay productos disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-600 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-slate-400">
                    <span>
                        Mostrando {productos.from ?? 0} a {productos.to ?? 0} de{" "}
                        {productos.total} productos
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={botonContorno}
                            disabled={!productos.prev_page_url}
                            onClick={() => irA(productos.prev_page_url)}
                        >
                            <ChevronLeft />
                            Anterior
                        </Button>
                        <span className="font-medium text-blue-800 dark:text-blue-300">
                            Página {productos.current_page} de{" "}
                            {productos.last_page}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={botonContorno}
                            disabled={!productos.next_page_url}
                            onClick={() => irA(productos.next_page_url)}
                        >
                            Siguiente
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}