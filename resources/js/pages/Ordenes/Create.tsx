
import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ClipboardList, Plus, Trash2 } from "lucide-react";
import { FormEventHandler } from "react";

interface Producto {
    id: number;
    nombre: string;
    costo: number;
    stock: number;
    proveedor_id: number;
}

interface Proveedor {
    id: number;
    nombre: string;
}

interface DetalleOrden {
    producto_id: string | number;
    producto_nombre?: string;
    cantidad: number;
    costoProducto: number;
}

interface Props {
    proveedores: Proveedor[];
    productos: Producto[];
}

const itemVacio: DetalleOrden = {
    producto_id: "",
    producto_nombre: "",
    cantidad: 1,
    costoProducto: 0,
};

const inputClass =
    "w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-blue-900/70 dark:bg-slate-950 dark:text-white";

const labelClass =
    "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300";

export default function Create({ proveedores, productos }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        proveedor_id: "",
        items: [{ ...itemVacio }] as DetalleOrden[],
    });

    const proveedorOptions = proveedores
        .map((p) => ({ value: String(p.id), label: p.nombre }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const productosFiltrados = productos.filter(
        (producto) => producto.proveedor_id === Number(data.proveedor_id),
    );

    const todosproductosagregados =
        productosFiltrados.length > 0 &&
        data.items.length >= productosFiltrados.length;

    const productosDisponibles = (indexActual: number) => {
        const idsElegidos = data.items
            .filter((_, index) => index !== indexActual)
            .map((item) => item.producto_id)
            .filter(Boolean);

        return productosFiltrados.filter(
            (producto) => !idsElegidos.includes(producto.id),
        );
    };

    const handleproveedorChange = (id: string) => {
        setData({
            ...data,
            proveedor_id: id,
            items: [{ ...itemVacio }],
        });
    };

    const handleAddItem = () => {
        setData("items", [...data.items, { ...itemVacio }]);
    };

    const seleccionarProducto = (index: number, id: string) => {
        const producto = productosFiltrados.find(
            (p) => p.id === Number(id),
        );

        const newItems = [...data.items];

        newItems[index] = {
            ...newItems[index],
            producto_id: producto ? producto.id : "",
            producto_nombre: producto ? producto.nombre : "",
            costoProducto: producto ? producto.costo : 0,
        };

        setData("items", newItems);
    };

    const handleItemChange = (
        index: number,
        field: string,
        value: any,
    ) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData("items", newItems);
    };

    const handleRemoveItem = (index: number) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index),
        );
    };

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => {
            const qty = Number(item.cantidad) || 0;
            const cost = Number(item.costoProducto) || 0;
            return sum + qty * cost;
        }, 0);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/ordenes");
    };

    return (
        <div className="min-h-full bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Encabezado */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <ClipboardList className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Nueva orden de compra
                            </h1>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                Registrá una compra a un proveedor
                            </p>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        <Link href="/ordenes">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a Ordenes
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Selección del proveedor */}
                    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <div className="mb-4">
                            <h2 className="font-semibold text-slate-900 dark:text-white">
                                Datos del proveedor
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Seleccioná el proveedor al que realizarás la compra.
                            </p>
                        </div>

                        <div>
                            <label className={labelClass}>
                                Proveedor
                            </label>

                            <Combobox
                                options={proveedorOptions}
                                value={data.proveedor_id}
                                onChange={handleproveedorChange}
                                placeholder="Seleccione un proveedor..."
                                searchPlaceholder="Buscar proveedor..."
                                emptyText="No se encontraron proveedores."
                            />

                            {errors.proveedor_id && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.proveedor_id}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">
                                    Productos a reabastecer
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Agregá los productos y sus cantidades.
                                </p>
                            </div>

                            <Button
                                type="button"
                                onClick={handleAddItem}
                                disabled={
                                    data.proveedor_id === "" ||
                                    todosproductosagregados
                                }
                                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar producto
                            </Button>
                        </div>

                        {todosproductosagregados && (
                            <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                Todos los productos de este proveedor ya fueron agregados.
                            </p>
                        )}

                        {data.proveedor_id === "" && (
                            <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-4 py-8 text-center dark:border-blue-900 dark:bg-slate-950">
                                <ClipboardList className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                                <p className="font-medium text-slate-700 dark:text-slate-300">
                                    Primero seleccioná un proveedor
                                </p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Después podrás elegir los productos correspondientes.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {data.items.map((item, index) => {
                                const errores =
                                    errors[`items.${index}.producto_id` as keyof typeof errors];

                                const disponibles = productosDisponibles(index);

                                const subtotal =
                                    (Number(item.cantidad) || 0) *
                                    (Number(item.costoProducto) || 0);

                                return (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-blue-100 bg-slate-50/70 p-4 dark:border-blue-900/50 dark:bg-slate-950"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                                Producto {index + 1}
                                            </span>

                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            {/* Producto */}
                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>
                                                    Producto
                                                </label>

                                                <Combobox
                                                    options={disponibles.map((p) => ({
                                                        value: String(p.id),
                                                        label: p.nombre,
                                                    }))}
                                                    value={String(item.producto_id)}
                                                    onChange={(v) => seleccionarProducto(index, v)}
                                                    disabled={data.proveedor_id === ""}
                                                    placeholder={
                                                        data.proveedor_id
                                                            ? "Seleccione un producto..."
                                                            : "Primero seleccione un proveedor"
                                                    }
                                                    searchPlaceholder="Buscar producto..."
                                                    emptyText="No hay productos disponibles."
                                                />

                                                {errores && (
                                                    <p className="mt-1 text-xs font-medium text-red-500">
                                                        {errores}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Cantidad */}
                                            <div>
                                                <label className={labelClass}>
                                                    Cantidad
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "cantidad",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* Costo unitario */}
                                            
{/* Costo unitario */}
<div>
    <label className={labelClass}>
        Costo unitario
    </label>

    <input
        type="number"
        value={item.costoProducto}
        readOnly
        className={`${inputClass} cursor-not-allowed bg-slate-100 dark:bg-slate-800`}
    />
</div>

                                        </div>

                                        {/* Subtotal */}
                                        <div className="mt-4 flex justify-end border-t border-blue-100 pt-3 dark:border-blue-900/50">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Subtotal
                                                </p>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                    ${subtotal.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {errors.items && (
                            <p className="mt-3 text-sm text-red-500">
                                {errors.items}
                            </p>
                        )}
                    </div>

                    {/* Total general */}
                    <div className="flex flex-col justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/30 sm:flex-row sm:items-center">
                        <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                Total de la compra
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Importe estimado de la orden
                            </p>
                        </div>

                        <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                            ${calculateTotal().toFixed(2)}
                        </span>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-slate-800"
                        >
                            <Link href="/ordenes">
                                Cancelar
                            </Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? "Guardando..." : "Guardar orden de compra"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
