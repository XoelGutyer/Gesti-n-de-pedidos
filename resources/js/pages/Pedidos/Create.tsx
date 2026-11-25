
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ClipboardList, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Combobox } from "@/components/combobox";

interface Cliente {
    id: number;
    nombre: string;
    email: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
}

interface Props {
    clientes: Cliente[];
    productos: Producto[];
}

export default function Create({ clientes, productos }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        cliente_id: "",
        items: [{ producto_id: "", cantidad: 1 }],
    });

    const clienteOptions = useMemo(
        () => clientes.map((c) => ({
            value: String(c.id),
            label: c.nombre,
        })),
        [clientes],
    );

    const productoOptions = useMemo(
        () =>
            productos.map((p) => ({
                value: String(p.id),
                label: `${p.nombre} - $${p.precio} (Stock: ${p.stock})`,
            })),
        [productos],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/pedidos");
    };

    const agregarProducto = () => {
        setData("items", [
            ...data.items,
            { producto_id: "", cantidad: 1 },
        ]);
    };

    const cambiarItem = (index: number, campo: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [campo]: value };
        setData("items", newItems);
    };

    const calcularTotal = () => {
        return data.items.reduce((sum, item) => {
            const producto = productos.find(
                (p) => p.id === Number(item.producto_id),
            );

            return sum + (
                producto ? producto.precio * Number(item.cantidad) : 0
            );
        }, 0);
    };

    const eliminarItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData("items", newItems);
    };

    return (
        <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
            <Head title="Nuevo pedido" />

            <div className="mx-auto max-w-4xl">

                {/* Encabezado */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <ClipboardList className="size-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Nuevo pedido
                            </h1>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Seleccioná un cliente y agregá los productos
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

                <form onSubmit={submit} className="flex flex-col gap-6">

                    {/* Selección de cliente */}
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Datos del pedido
                        </h2>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Cliente
                            </label>

                            <Combobox
                                options={clienteOptions}
                                value={data.cliente_id}
                                onChange={(v) => setData("cliente_id", v)}
                                placeholder="Seleccione un cliente"
                                searchPlaceholder="Buscar cliente..."
                                emptyText="No se encontraron clientes."
                            />

                            <InputError
                                message={errors.cliente_id}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Productos del pedido
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Agregá los productos y sus cantidades
                                </p>
                            </div>

                            <Button
                                type="button"
                                onClick={agregarProducto}
                                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                <Plus className="mr-2 size-4" />
                                Agregar producto
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {data.items.map((item, index) => {
                                const selectedProduct = productos.find(
                                    (p) => p.id === Number(item.producto_id),
                                );

                                const subtotal = selectedProduct
                                    ? selectedProduct.precio * Number(item.cantidad)
                                    : 0;

                                return (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-blue-100 bg-slate-50/70 p-4 dark:border-blue-900/50 dark:bg-slate-950/50"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                                Producto {index + 1}
                                            </span>

                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarItem(index)}
                                                    className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_130px_auto] md:items-end">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Producto
                                                </label>

                                                <Combobox
                                                    options={productoOptions}
                                                    value={item.producto_id}
                                                    onChange={(v) =>
                                                        cambiarItem(index, "producto_id", v)
                                                    }
                                                    placeholder="Seleccione un producto"
                                                    searchPlaceholder="Buscar producto..."
                                                    emptyText="No se encontraron productos."
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Cantidad
                                                </label>

                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) =>
                                                        cambiarItem(index, "cantidad", e.target.value)
                                                    }
                                                    className="border-blue-200 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-blue-900/70 dark:bg-slate-950"
                                                />
                                            </div>

                                            <div className="rounded-md bg-blue-50 px-4 py-2 text-right dark:bg-blue-950/40">
                                                <span className="block text-xs text-slate-500 dark:text-slate-400">
                                                    Subtotal
                                                </span>
                                                <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                                                    ${subtotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total */}
                        <div className="mt-6 flex justify-end border-t border-blue-100 pt-5 dark:border-blue-900/50">
                            <div className="rounded-lg bg-blue-50 px-6 py-4 text-right dark:bg-blue-950/40">
                                <span className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total del pedido
                                </span>
                                <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                    ${calcularTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end gap-3">
                        <Button
                            asChild
                            type="button"
                            variant="outline"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
                        >
                            <Link href="/pedidos">Cancelar</Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            {processing ? "Guardando..." : "Crear pedido"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
