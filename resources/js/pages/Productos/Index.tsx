import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
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

const peso = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

const selectClase =
    'rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700';

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
    const Icono = orden !== campo ? ArrowUpDown : direccion === 'asc' ? ArrowUp : ArrowDown;

    return (
        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
            <button
                type="button"
                onClick={() => onClick(campo)}
                className="flex items-center gap-1.5 hover:text-black dark:hover:text-white"
            >
                {children}
                <Icono className={`size-3.5 ${orden === campo ? '' : 'text-gray-400'}`} />
            </button>
        </th>
    );
}

export default function Index({ productos, proveedores, filtros, flash }: Props) {
    // Lo que viene del servidor es la fuente de verdad; solo el buscador necesita estado propio
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const proveedor = filtros.proveedor ?? '';
    const orden = filtros.orden ?? 'nombre';
    const direccion = filtros.direccion ?? 'asc';
    const porPagina = filtros.por_pagina ?? 5;

    const aplicar = (cambios: Partial<{ buscar: string; proveedor: string; orden: string; direccion: string; por_pagina: number }> = {}) => {
        router.get(
            '/productos',
            { buscar, proveedor, orden, direccion, por_pagina: porPagina, ...cambios },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const buscarProductos = (e: FormEvent) => {
        e.preventDefault();
        aplicar();
    };

    const ordenarPor = (campo: string) => {
        const nueva = orden === campo && direccion === 'asc' ? 'desc' : 'asc';
        aplicar({ orden: campo, direccion: nueva });
    };

    const limpiar = () => {
        setBuscar('');
        router.get('/productos', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const irA = (url: string | null) => {
        if (url) router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    const eliminar = (p: Producto) => {
        if (confirm(`¿Está seguro de eliminar "${p.nombre}"?`)) {
            router.delete(`/productos/${p.id}`, { preserveScroll: true });
        }
    };

    const hayFiltros = buscar !== '' || proveedor !== '';

    return (
        <div className="p-6">
            <Head title="Productos" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h1>
                    <h4 className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Lista de productos registrados en el sistema.
                    </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" asChild>
                        <a href="/catalogo/pdf" target="_blank" rel="noopener noreferrer">
                            <FileText />
                            Catálogo PDF
                        </a>
                    </Button>
                    <Button asChild>
                        <Link href="/productos/create">
                            <Plus />
                            Nuevo producto
                        </Link>
                    </Button>
                </div>
            </div>

            {flash?.success && (
                <div
                    className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                    role="alert"
                >
                    {flash.success}
                </div>
            )}

            <form onSubmit={buscarProductos} className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        placeholder="Buscar producto"
                        className="w-56"
                    />
                    <Button type="submit" variant="outline" size="icon" title="Buscar" aria-label="Buscar">
                        <Search />
                    </Button>
                </div>

                <select
                    className={selectClase}
                    value={proveedor}
                    onChange={(e) => aplicar({ proveedor: e.target.value })}
                    aria-label="Filtrar por proveedor"
                >
                    <option value="">Todos los proveedores</option>
                    {Object.entries(proveedores).map(([id, nombre]) => (
                        <option key={id} value={id} className="text-black">
                            {nombre}
                        </option>
                    ))}
                </select>

                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    Mostrar
                    <select
                        className={selectClase}
                        value={porPagina}
                        onChange={(e) => aplicar({ por_pagina: Number(e.target.value) })}
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n} className="text-black">
                                {n}
                            </option>
                        ))}
                    </select>
                    filas
                </label>

                {hayFiltros && (
                    <Button type="button" variant="ghost" size="sm" onClick={limpiar}>
                        <X />
                        Limpiar filtros
                    </Button>
                )}
            </form>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Imagen</th>
                                <Ordenable campo="nombre" orden={orden} direccion={direccion} onClick={ordenarPor}>
                                    Nombre
                                </Ordenable>
                                <Ordenable campo="precio" orden={orden} direccion={direccion} onClick={ordenarPor}>
                                    Precio
                                </Ordenable>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Stock</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Proveedor</th>
                                <th className="sticky right-0 bg-gray-50 px-4 py-3 text-right font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {productos.data.length > 0 ? (
                                productos.data.map((producto) => (
                                    <tr
                                        key={producto.id}
                                        className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-3">
                                            {producto.imagen ? (
                                                <img
                                                    src={`/storage/${producto.imagen}`}
                                                    alt={producto.nombre}
                                                    loading="lazy"
                                                    className="size-12 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="size-12 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                            {producto.nombre}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums text-gray-600 dark:text-gray-400">
                                            {peso.format(Number(producto.precio))}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    producto.stock === 0
                                                        ? 'destructive'
                                                        : producto.stock <= 10
                                                          ? 'secondary'
                                                          : 'outline'
                                                }
                                            >
                                                {producto.stock}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                            {producto.proveedor.nombre}
                                        </td>
                                        <td className="sticky right-0 bg-white px-4 py-3 group-hover:bg-gray-50 dark:bg-gray-900 dark:group-hover:bg-gray-800">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild size="icon" variant="outline" title="Editar" aria-label="Editar">
                                                    <Link href={`/productos/${producto.id}/edit`}>
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    title="Eliminar"
                                                    aria-label="Eliminar"
                                                    onClick={() => eliminar(producto)}
                                                >
                                                    <Trash2 className="text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No hay productos disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    <span>
                        Mostrando {productos.from ?? 0} a {productos.to ?? 0} de {productos.total} productos
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!productos.prev_page_url}
                            onClick={() => irA(productos.prev_page_url)}
                        >
                            <ChevronLeft />
                            Anterior
                        </Button>
                        <span>
                            Página {productos.current_page} de {productos.last_page}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
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