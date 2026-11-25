
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock,
    Package,
    Truck,
    XCircle,
} from "lucide-react";

interface Item {
    id: number;
    cantidad: number;
    costoProducto: string;
    producto_id: number;
    producto: {
        id: number;
        nombre: string;
        stock: number;
    };
}

interface Orden {
    id: number;
    total: string;
    estado: "solicitado" | "recibido" | "cancelado";
    created_at: string;
    proveedor: {
        nombre: string;
        id: string;
        email: string | null;
        telefono: string | null;
    };
    usuario: {
        name: string;
    };
    items: Item[];
}

const statusConfig: Record<
    string,
    { label: string; classes: string }
> = {
    solicitado: {
        label: "Solicitado",
        classes:
            "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/50 dark:text-yellow-300",
    },
    recibido: {
        label: "Recibido",
        classes:
            "border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300",
    },
    cancelado: {
        label: "Cancelado",
        classes:
            "border-red-200 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
    },
};

const inputClass =
    "w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-center text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-blue-900/70 dark:bg-slate-950 dark:text-white";

export default function Show({ orden }: { orden: Orden }) {
    const isFinalState =
        orden.estado === "recibido" || orden.estado === "cancelado";

    const badge = statusConfig[orden.estado];

    const { data, setData, errors } = useForm({
        estado: orden.estado,
        items: orden.items.map((item) => ({
            id: item.id,
            producto_id: item.producto_id,
            cantidad: Number(item.cantidad),
            costo: Number(item.costoProducto),
        })),
    });

    // Actualiza cantidad o costo de una fila específica
    const handleItemChange = (
        index: number,
        field: "cantidad" | "costo",
        value: string,
    ) => {
        const updatedItems = [...data.items];

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value === "" ? 0 : Number(value),
        };

        setData("items", updatedItems);
    };

    // Total actualizado
    const liveTotal = data.items.reduce(
        (sum, item) =>
            sum + Number(item.cantidad) * Number(item.costo),
        0,
    );

    const unidades = orden.items.reduce(
        (sum, item) => sum + item.cantidad,
        0,
    );

    // Cambiar estado de la orden
    const handleStatusUpdate = (
        newStatus: "solicitado" | "recibido" | "cancelado",
    ) => {
        if (
            newStatus === "recibido" &&
            !confirm(
                "¿Confirmas la recepción física? Esto sumará las cantidades al inventario.",
            )
        ) {
            return;
        }

        if (
            newStatus === "cancelado" &&
            !confirm("¿Seguro que deseas cancelar esta orden de compra?")
        ) {
            return;
        }

        router.patch(
            `/ordenes/${orden.id}/estado`,
            {
                ...data,
                estado: newStatus,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="min-h-full bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Encabezado */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <Truck className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Orden de compra #{orden.id}
                            </h1>

                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                Detalle y seguimiento de la compra
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        asChild
                        className="w-fit border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-slate-800"
                    >
                        <Link href="/ordenes">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a órdenes
                        </Link>
                    </Button>
                </div>

                {/* Información general */}
                <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                    <div className="flex flex-col justify-between gap-4 border-b border-blue-100 pb-5 dark:border-blue-900/50 md:flex-row md:items-start">
                        <div>
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Información de la orden
                                </h2>

                                <Badge
                                    variant="outline"
                                    className={`gap-1.5 ${badge.classes}`}
                                >
                                    {orden.estado === "solicitado" && (
                                        <Clock className="h-3.5 w-3.5" />
                                    )}

                                    {orden.estado === "recibido" && (
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                    )}

                                    {orden.estado === "cancelado" && (
                                        <XCircle className="h-3.5 w-3.5" />
                                    )}

                                    {badge.label}
                                </Badge>
                            </div>

                            <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:gap-4">
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-blue-500" />
                                    {new Date(orden.created_at).toLocaleString("es-AR")}
                                </span>

                                <span>
                                    Registrada por{" "}
                                    <strong className="font-semibold text-slate-700 dark:text-slate-300">
                                        {orden.usuario.name}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        {/* Acciones de estado */}
                        {!isFinalState && (
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        handleStatusUpdate("recibido")
                                    }
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Confirmar recepción
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        handleStatusUpdate("cancelado")
                                    }
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancelar orden
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Datos del proveedor */}
                    <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Proveedor
                            </span>

                            <p className="font-semibold text-slate-900 dark:text-white">
                                {orden.proveedor.nombre}
                            </p>
                        </div>

                        <div>
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Identificación fiscal
                            </span>

                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                {orden.proveedor.id}
                            </p>
                        </div>

                        <div>
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Contacto
                            </span>

                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                {orden.proveedor.telefono ||
                                    orden.proveedor.email ||
                                    "Sin datos de contacto"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Resumen de productos */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <Package className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Productos diferentes
                            </p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                {orden.items.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <Truck className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Unidades pedidas
                            </p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                {unidades}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detalle de productos */}
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                    <div className="border-b border-blue-100 px-5 py-4 dark:border-blue-900/50">
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Detalle de productos
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Revisá las cantidades recibidas y actualizá los costos si corresponde.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[850px] w-full">
                            <thead className="bg-blue-50 dark:bg-slate-950">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                                        Producto
                                    </th>

                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                                        Cantidad pedida
                                    </th>

                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                                        Cantidad recibida
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                                        Costo original
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                                        Nuevo costo
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-blue-50 dark:divide-blue-900/30">
                                {orden.items.map((item, index) => {
                                    const itemEditable = data.items[index];

                                    const subtotal =
                                        itemEditable.cantidad *
                                        Number(itemEditable.costo);

                                    return (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-blue-50/50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                                {item.producto.nombre}
                                            </td>

                                            <td className="px-5 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                                                {item.cantidad}
                                            </td>

                                            {/* Cantidad recibida */}
                                            <td className="px-5 py-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={itemEditable.cantidad}
                                                    disabled={isFinalState}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "cantidad",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                />

                                                {errors[`items.${index}.cantidad` as keyof typeof errors] && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors[`items.${index}.cantidad` as keyof typeof errors]}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Costo original */}
                                            <td className="px-5 py-4 text-right text-sm text-slate-500 dark:text-slate-400">
                                                ${Number(item.costoProducto).toFixed(2)}
                                            </td>

                                            {/* Nuevo costo */}
                                            <td className="px-5 py-4">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={itemEditable.costo}
                                                    disabled={isFinalState}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "costo",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                />

                                                {errors[`items.${index}.costo` as keyof typeof errors] && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors[`items.${index}.costo` as keyof typeof errors]}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Subtotal */}
                                            <td className="px-5 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">
                                                ${subtotal.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot className="border-t border-blue-100 bg-blue-50/70 dark:border-blue-900/50 dark:bg-slate-950">
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300"
                                    >
                                        Total de la orden:
                                    </td>

                                    <td className="px-5 py-4 text-right text-xl font-extrabold text-blue-700 dark:text-blue-300">
                                        ${liveTotal.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Información de estado final */}
                {isFinalState && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
                        {orden.estado === "recibido"
                            ? "Esta orden ya fue recibida. El inventario fue actualizado y no se pueden modificar sus cantidades ni costos desde aquí."
                            : "Esta orden fue cancelada y ya no admite modificaciones."}
                    </div>
                )}

                {!isFinalState && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Los cambios en cantidades y costos se enviarán al confirmar la recepción de la orden.
                    </p>
                )}
            </div>
        </div>
    );
}
