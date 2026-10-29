import { Button } from "@/components/ui/button";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState, type FormEvent } from 'react';

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
    proveedor: string,
    orden: string,
    direccion: string,
    por_pagina: number;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    costo: number;
    stock: number;
    imagen: string;
    proveedor: {
        nombre: string;
    };
}

interface Props {
    productos: ProductosPaginados;
    proveedores: Record<number, string>;
    filtros: Filtros;
    flash?: {
        success?: string;
    };
}
export default function Index({ productos, proveedores, filtros, flash }: Props) {
    const eliminar = (id: number) => {
        if (confirm("¿Está seguro de eliminar este producto?")) {
            router.delete(`/productos/${id}`);
        }
    };
    const aplicarfiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get('/productos', {
            buscar,
            proveedor,
            orden,
            direccion,
            por_pagina: porPagina,
        }, { preserveState: true });
    };
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [proveedor, setProveedor] = useState(filtros.proveedor ?? '');

    const [orden, setOrden] = useState(filtros.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(
        filtros.direccion ?? 'asc'
    );

    const ordenarPor = (campo: string) => {
        let nuevaDireccion = 'asc';
        if (orden === campo && direccion === 'asc') {
            nuevaDireccion = 'desc';
        }
        setOrden(campo);
        setDireccion(nuevaDireccion);
        router.get('/productos', {
            buscar, //conservamos el filtro
            proveedor,
            orden: campo,
            direccion: nuevaDireccion,
            por_pagina: porPagina,
        });
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) {
            return '';
        }
        return direccion === 'asc' ? ' ↑' : ' ↓';
    };

    const [porPagina, setPorPagina] = useState(
        filtros.por_pagina ?? 5
    );

    return (
        <div>
            <div className="w-full max-w-7xl mx-auto mt-10 p-6 space-y-6">
                <Head>
                    <title>Listado de productos</title>
                </Head>

                <div className="flex justify-between items-center">
                    <div className="overflow-x-auto">
                        <h1 className="text-2xl font-bold text-white">
                            Productos
                        </h1>
                        <h4 className="text-sm text-white">
                            Lista de productos registrados en el sistema.
                        </h4>
                    </div>

                    {flash?.success && (
                        <div
                            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {flash.success}
                            </span>
                        </div>
                    )}

                    <Button asChild>
                        <a
                            href="/catalogo/pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Plus />
                            Generar catálogo PDF
                        </a>
                    </Button>

                    <Button asChild>
                        <Link href="/productos/create">
                            <Plus />
                            Nuevo producto
                        </Link>
                    </Button>
                </div>

                <form onSubmit={aplicarfiltros} className="flex flex-col md:flex-row items-end gap-4">
                    <input
                        type="text"
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        placeholder="Buscar Producto"
                    />
                    <select
                        value={proveedor}
                        onChange={(e) => setProveedor(e.target.value)}
                    >
                        <option value="">Todos los proveedores</option>
                        {Object.entries(proveedores).map(([id, nombre]) => (
                            <option key={id} value={id}>
                                {id} - {nombre}
                            </option>
                        ))}
                    </select>

                    <label>
                        Mostrar:
                        <select
                            value={porPagina}
                            onChange={(e) => setPorPagina(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        filas
                    </label>

                </form>

                <div className="w-full rounded-xl shadow-sm bg-card border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-white ">Imagen</th>
                                    <th onClick={() => ordenarPor('nombre')} className="px-6 py-4 font-semibold text-white cursor-pointer" >
                                        <div className="flex items-center gap-1.5">
                                            <span>nombre</span>
                                            {/* Evaluamos qué icono mostrar según el estado actual */}
                                            {orden !== 'nombre' ? (
                                                // Si no se está ordenando por este campo, mostramos el icono neutral
                                                < ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                                            ) : direccion === 'asc' ? (
                                                // Si está en ascendente, flecha arriba en un color más oscuro/activo
                                                <ArrowUp className="w-3.5 h-3.5 text-gray-700 font-bold" />
                                            ) : (
                                                // Si está en descendente, flecha abajo activa
                                                <ArrowDown className="w-3.5 h-3.5 text-gray-700 font-bold" />
                                            )}
                                        </div>
                                    </th>
                                    <th onClick={() => ordenarPor('precio')} className="px-6 py-4 font-semibold text-white cursor-pointer">Precio {indicadorOrden('precio')}</th>
                                    {/*<th onClick={() => ordenarPor('costo')} className="px-6 py-4 font-semibold text-white cursor-pointer">Costo {indicadorOrden('costo')}</th>*/}
                                    <th className="px-6 py-4 font-semibold text-white">Stock</th>
                                    {/*<th className="px-6 py-4 font-semibold text-white">Imagen</th>*/}
                                    <th className="px-6 py-4 font-semibold text-white">Proveedor</th>
                                    <th className="px-6 py-4 font-semibold text-white">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {productos.data.length > 0 ? (
                                    productos.data.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {producto.imagen ? (
                                                    <img
                                                        src={`/storage/${producto.imagen}`}
                                                        alt={producto.nombre}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {producto.nombre}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {producto.precio}
                                            </td>
                                            {/*<td className="px-6 py-4 font-medium text-gray-900">{producto.costo}</td>*/}
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {producto.stock}
                                            </td>
                                            {/*<td className="px-6 py-4 font-medium text-gray-900">{producto.imagen && <img src={`/storage/${producto.imagen}`} alt={producto.nombre} className="w-16 h-16 object-cover" />}</td>*/}
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {producto.proveedor.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="default"
                                                        className="bg-gray-600 hover:bg-blue-700"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/productos/${producto.id}/edit`}
                                                        >
                                                            Editar
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="destructive"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/productos/${producto.id}`}
                                                            method="delete"
                                                        >
                                                            Eliminar
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-10 text-center text-gray-400"
                                        >
                                            No hay productos disponibles.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <p>
                            Mostrando {productos.from ?? 0} a {productos.to ?? 0}
                            {' '}de {productos.total} productos
                        </p>

                        <div>
                            {productos.prev_page_url && (
                                <button
                                    type="button"
                                    onClick={() => router.get(productos.prev_page_url!)}
                                >
                                    Anterior
                                </button>
                            )}
                            <span>
                                Página {productos.current_page} de {productos.last_page}
                            </span>
                            {productos.next_page_url && (
                                <button
                                    type="button"
                                    onClick={() => router.get(productos.next_page_url!)}
                                >
                                    Siguiente
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
