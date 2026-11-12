import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface ProductoOpcion {
    id: number;
    nombre: string;
    precio: number;
    descuento: number;
    disponible: number;
}
interface Linea {
    producto_id: number;
    cantidad: number;
}
interface Props {
    pedido: { id: number; cliente: string; items: Linea[] };
    productos: ProductoOpcion[];
}

const peso = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

export default function EditarItems({ pedido, productos }: Props) {
    const form = useForm<{ items: Linea[] }>({ items: pedido.items });
    const items = form.data.items;

    const producto = (id: number) => productos.find((p) => p.id === id)!;
    const precioFinal = (p: ProductoOpcion) => p.precio * (1 - p.descuento / 100);
    const total = items.reduce((s, i) => s + precioFinal(producto(i.producto_id)) * i.cantidad, 0);

    const cambiarCantidad = (id: number, cantidad: number) =>
        form.setData('items', items.map((i) => (i.producto_id === id ? { ...i, cantidad } : i)));

    const quitar = (id: number) => form.setData('items', items.filter((i) => i.producto_id !== id));

    const agregar = (id: number) => {
        if (!id) return;
        form.setData('items', [...items, { producto_id: id, cantidad: 1 }]);
    };

    const disponibles = productos.filter((p) => p.disponible > 0 && !items.some((i) => i.producto_id === p.id));
    const errores = Object.values(form.errors);

    return (
        <div className="mx-auto max-w-3xl p-6">
            <Head title={`Editar pedido #${pedido.id}`} />
            <h1 className="mb-1 text-2xl font-bold text-white">Editar ítems del pedido #{pedido.id}</h1>
            <p className="mb-6 text-sm text-gray-400">Cliente: {pedido.cliente}</p>

            {errores.length > 0 && (
                <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
                    {errores.map((e, i) => (
                        <p key={i}>{e}</p>
                    ))}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3">Producto</th>
                            <th className="px-4 py-3">Precio</th>
                            <th className="px-4 py-3">Cantidad</th>
                            <th className="px-4 py-3 text-right">Subtotal</th>
                            <th className="w-10" />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((i) => {
                            const p = producto(i.producto_id);
                            return (
                                <tr key={i.producto_id} className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="px-4 py-3">
                                        {p.nombre}
                                        {p.descuento > 0 && (
                                            <span className="ml-2 text-xs text-red-500">-{p.descuento}%</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">{peso.format(precioFinal(p))}</td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={p.disponible}
                                            value={i.cantidad}
                                            className="w-24"
                                            onChange={(e) => cambiarCantidad(i.producto_id, Number(e.target.value))}
                                        />
                                        <span className="text-xs text-gray-500">máx. {p.disponible}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right tabular-nums">
                                        {peso.format(precioFinal(p) * i.cantidad)}
                                    </td>
                                    <td className="px-2">
                                        <Button type="button" size="icon" variant="ghost" onClick={() => quitar(i.producto_id)}>
                                            <Trash2 className="size-4 text-red-500" />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    El pedido necesita al menos un producto.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <select
                    className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"
                    value=""
                    onChange={(e) => agregar(Number(e.target.value))}
                >
                    <option value="">+ Agregar producto…</option>
                    {disponibles.map((p) => (
                        <option key={p.id} value={p.id} className="text-black">
                            {p.nombre} ({p.disponible} en stock)
                        </option>
                    ))}
                </select>
                <div className="text-lg font-bold tabular-nums">Total: {peso.format(total)}</div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/pedidos">Cancelar</Link>
                </Button>
                <Button
                    disabled={form.processing || items.length === 0}
                    onClick={() => form.put(`/pedidos/${pedido.id}/items`)}
                >
                    Guardar cambios
                </Button>
            </div>
        </div>
    );
}