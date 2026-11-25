import { useState } from 'react';
import type { ReactNode } from 'react';
import { Head, router } from '@inertiajs/react';
import { Package, RotateCcw, Trash2, Truck, Users, type LucideIcon } from 'lucide-react';

type Producto = {
    id: number;
    nombre: string;
    precio: number | string;
    stock: number;
};

type Proveedor = {
    id: number;
    nombre: string;
};

interface Cliente {
    id: number;
    nombre: string;
    direccion: string;
    email: string;
    dia: string;
    celular: string;
}

type Props = {
    productos: Producto[];
    proveedores: Proveedor[];
    clientes: Cliente[];
};

type Pestana = 'productos' | 'proveedores' | 'clientes';

const peso = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Estilos reutilizables (paleta azul)
const filaClase = 'transition-colors hover:bg-blue-50/70 dark:hover:bg-blue-950/40';

function Panel({ titulo, children }: { titulo: string; children: ReactNode }) {
    return (
        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
            <div className="border-b border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
                <h2 className="font-semibold text-blue-950 dark:text-blue-100">{titulo}</h2>
            </div>
            {children}
        </div>
    );
}

function Vacio({ icono: Icono, titulo, texto }: { icono: LucideIcon; titulo: string; texto: string }) {
    return (
        <div className="p-12 text-center">
            <Icono className="mx-auto mb-3 h-10 w-10 text-blue-300 dark:text-blue-800" />
            <p className="font-medium text-slate-800 dark:text-slate-100">{titulo}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{texto}</p>
        </div>
    );
}

function BotonReactivar({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-600 hover:text-white dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white"
        >
            <RotateCcw className="h-4 w-4" />
            Reactivar
        </button>
    );
}

function Encabezado({ columnas }: { columnas: { texto: string; derecha?: boolean }[] }) {
    return (
        <thead className="bg-blue-600 text-white dark:bg-blue-900/70">
            <tr>
                {columnas.map((c) => (
                    <th
                        key={c.texto}
                        className={`px-4 py-3 font-semibold ${c.derecha ? 'text-right' : 'text-left'}`}
                    >
                        {c.texto}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export default function Index({ productos, proveedores, clientes }: Props) {
    const [pestana, setPestana] = useState<Pestana>('productos');

    const activarProducto = (id: number) => {
        if (!confirm('¿Querés reactivar este producto?')) return;

        router.patch(`/papelera/productos/${id}/activar`, {}, { preserveScroll: true });
    };

    const activarProveedor = (id: number) => {
        if (!confirm('¿Querés reactivar este proveedor?')) return;

        router.patch(`/papelera/proveedores/${id}/activar`, {}, { preserveScroll: true });
    };

    const restaurarCliente = (id: number) => {
        if (!confirm('¿Querés reactivar este cliente?')) return;

        router.put(`/papelera/clientes/${id}/restaurar`, {}, { preserveScroll: true });
    };

    const pestanas: { id: Pestana; label: string; icono: LucideIcon; cantidad: number }[] = [
        { id: 'productos', label: 'Productos', icono: Package, cantidad: productos.length },
        { id: 'proveedores', label: 'Proveedores', icono: Truck, cantidad: proveedores.length },
        { id: 'clientes', label: 'Clientes', icono: Users, cantidad: clientes.length },
    ];

    return (
        <>
            <Head title="Papelera" />

            <div className="p-6">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Encabezado */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <Trash2 className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Papelera</h1>
                            <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                                Consultá los registros desactivados y recuperá los que quieras volver a utilizar.
                            </p>
                        </div>
                    </div>

                    {/* Pestañas */}
                    <div className="flex flex-wrap gap-2 border-b border-blue-100 dark:border-blue-900/50">
                        {pestanas.map((p) => {
                            const activa = pestana === p.id;

                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPestana(p.id)}
                                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                                        activa
                                            ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                                            : 'border-transparent text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300'
                                    }`}
                                >
                                    <p.icono className="h-4 w-4" />
                                    {p.label}
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                            activa
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                        }`}
                                    >
                                        {p.cantidad}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Productos */}
                    {pestana === 'productos' && (
                        <Panel titulo="Productos desactivados">
                            {productos.length === 0 ? (
                                <Vacio
                                    icono={Package}
                                    titulo="No hay productos en la papelera"
                                    texto="Los productos desactivados aparecerán aquí."
                                />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <Encabezado
                                            columnas={[
                                                { texto: 'Nombre' },
                                                { texto: 'Precio' },
                                                { texto: 'Stock' },
                                                { texto: 'Acción', derecha: true },
                                            ]}
                                        />
                                        <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
                                            {productos.map((producto) => (
                                                <tr key={producto.id} className={filaClase}>
                                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                        {producto.nombre}
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-blue-700 tabular-nums dark:text-blue-300">
                                                        {peso.format(Number(producto.precio))}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 tabular-nums dark:text-slate-400">
                                                        {producto.stock}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <BotonReactivar onClick={() => activarProducto(producto.id)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Panel>
                    )}

                    {/* Proveedores */}
                    {pestana === 'proveedores' && (
                        <Panel titulo="Proveedores desactivados">
                            {proveedores.length === 0 ? (
                                <Vacio
                                    icono={Truck}
                                    titulo="No hay proveedores en la papelera"
                                    texto="Los proveedores desactivados aparecerán aquí."
                                />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <Encabezado
                                            columnas={[{ texto: 'Nombre' }, { texto: 'Acción', derecha: true }]}
                                        />
                                        <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
                                            {proveedores.map((proveedor) => (
                                                <tr key={proveedor.id} className={filaClase}>
                                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                        {proveedor.nombre}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <BotonReactivar onClick={() => activarProveedor(proveedor.id)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Panel>
                    )}

                    {/* Clientes */}
                    {pestana === 'clientes' && (
                        <Panel titulo="Clientes desactivados">
                            {clientes.length === 0 ? (
                                <Vacio
                                    icono={Users}
                                    titulo="No hay clientes en la papelera"
                                    texto="Los clientes desactivados aparecerán aquí."
                                />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <Encabezado
                                            columnas={[
                                                { texto: 'Nombre' },
                                                { texto: 'Dirección' },
                                                { texto: 'Email' },
                                                { texto: 'Día' },
                                                { texto: 'Celular' },
                                                { texto: 'Acción', derecha: true },
                                            ]}
                                        />
                                        <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
                                            {clientes.map((cliente) => (
                                                <tr key={cliente.id} className={filaClase}>
                                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                        {cliente.nombre}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {cliente.direccion}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {cliente.email}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {cliente.dia ? (
                                                            <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                                                {capitalize(cliente.dia)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {cliente.celular}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <BotonReactivar onClick={() => restaurarCliente(cliente.id)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Panel>
                    )}
                </div>
            </div>
        </>
    );
}