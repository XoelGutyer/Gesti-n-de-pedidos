
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ClipboardList, PackagePlus, Trash2 } from "lucide-react";
import { Combobox } from "@/components/combobox";

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

const peso = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

const inputClass = `
    w-24 border-blue-200 bg-white text-slate-900
    focus-visible:border-blue-500 focus-visible:ring-blue-500
    dark:border-blue-900/70 dark:bg-slate-950 dark:text-slate-100
`;

export default function EditarItems({ pedido, productos }: Props) {
    const form = useForm<{ items: Linea[] }>({ items: pedido.items });
    const items = form.data.items;

    const producto = (id: number) => productos.find((p) => p.id === id)!;
    const precioFinal = (p: ProductoOpcion) =>
        p.precio * (1 - p.descuento / 100);

    const total = items.reduce(
        (s, i) => s + precioFinal(producto(i.producto_id)) * i.cantidad,
        0,
    );

    const cambiarCantidad = (id: number, cantidad: number) =>
        form.setData(
            "items",
            items.map((i) =>
                i.producto_id === id ? { ...i, cantidad } : i,
            ),
        );

    const quitar = (id: number) =>
        form.setData(
            "items",
            items.filter((i) => i.producto_id !== id),
        );

    const agregar = (id: number) => {
        if (!id) return;

        form.setData("items", [
            ...items,
            { producto_id: id, cantidad: 1 },
        ]);
    };

    const disponibles = productos.filter(
        (p) =>
            p.disponible > 0 &&
            !items.some((i) => i.producto_id === p.id),
    );

    const errores = Object.values(form.errors);

    const opcionesDisponibles = disponibles.map((p) => ({
    value: String(p.id),
    label: `${p.nombre} (${p.disponible} en stock)`,
    }));

    return (
        <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
            <Head title={`Editar pedido #${pedido.id}`} />

            <div className="mx-auto max-w-5xl">

                {/* Encabezado */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <ClipboardList className="size-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Editar pedido #{pedido.id}
                            </h1>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Modificá los productos y cantidades del pedido
                            </p>
                        </div>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
                    >
                        <Link href="/pedidos">
                            <ArrowLeft className="mr-2 size-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </div>

                {/* Información del cliente */}
                <div className="mb-5 rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Cliente
                    </span>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                        {pedido.cliente}
                    </p>
                </div>

                {/* Errores generales */}
                {errores.length > 0 && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        {errores.map((e, i) => (
                            <p key={i}>{e}</p>
                        ))}
                    </div>
                )}

                {/* Tabla de productos */}
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                    <div className="border-b border-blue-100 px-5 py-4 dark:border-blue-900/50">
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Productos del pedido
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Modificá las cantidades o eliminá productos
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-blue-100 bg-blue-50/70 dark:border-blue-900/50 dark:bg-slate-950">
                                <tr className="text-slate-600 dark:text-slate-300">
                                    <th className="px-4 py-3 font-semibold">Producto</th>
                                    <th className="px-4 py-3 font-semibold">Precio</th>
                                    <th className="px-4 py-3 font-semibold">Cantidad</th>
                                    <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                                    <th className="w-12 px-2 py-3" />
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((i) => {
                                    const p = producto(i.producto_id);

                                    return (
                                        <tr
                                            key={i.producto_id}
                                            className="border-b border-blue-50 transition-colors hover:bg-blue-50/40 dark:border-blue-900/30 dark:hover:bg-blue-950/20"
                                        >
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {p.nombre}
                                                </span>

                                                {p.descuento > 0 && (
                                                    <span className="ml-2 inline-flex rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300">
                                                        -{p.descuento}%
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap tabular-nums text-slate-600 dark:text-slate-300">
                                                {peso.format(precioFinal(p))}
                                            </td>

                                            <td className="px-4 py-4">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={p.disponible}
                                                    value={i.cantidad}
                                                    className={inputClass}
                                                    onChange={(e) =>
                                                        cambiarCantidad(
                                                            i.producto_id,
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                />
                                                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                                                    Máx. {p.disponible}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-right whitespace-nowrap font-semibold tabular-nums text-slate-900 dark:text-white">
                                                {peso.format(
                                                    precioFinal(p) * i.cantidad,
                                                )}
                                            </td>

                                            <td className="px-2 py-4 text-center">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => quitar(i.producto_id)}
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            <PackagePlus className="mx-auto mb-2 size-8 text-blue-400" />
                                            El pedido necesita al menos un producto.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Agregar producto y total */}
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Agregar otro producto
                        </label>

                        {/* Agregar producto */}
<div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
    <div className="mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white">
            Agregar otro producto
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
            Buscá un producto por su nombre.
        </p>
    </div>

    <Combobox
        options={opcionesDisponibles}
        value=""
        onChange={(valor) => {
            if (valor) {
                agregar(Number(valor));
            }
        }}
        placeholder="Seleccione un producto..."
        searchPlaceholder="Buscar producto..."
        emptyText="No hay productos disponibles."
    />
</div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/30">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Total del pedido
                        </span>

                        <span className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-300">
                            {peso.format(total)}
                        </span>
                    </div>
                </div>

                {/* Botones */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
                    >
                        <Link href="/pedidos">Cancelar</Link>
                    </Button>

                    <Button
                        disabled={form.processing || items.length === 0}
                        onClick={() => form.put(`/pedidos/${pedido.id}/items`)}
                        className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        {form.processing ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
