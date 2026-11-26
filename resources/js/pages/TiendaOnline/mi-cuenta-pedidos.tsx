import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock,
    Package,
    ShoppingBag,
    StickyNote,
} from "lucide-react";

type Item = {
    id: number;
    producto: string;
    cantidad: number;
    precio_unitario: number | string;
    descuento: number;
    subtotal: number | string;
};

type PageProps = {
    pedido: {
        id: number;
        fecha: string;
        total: number | string;
        pagado: boolean;
        nota: string | null;
        items: Item[];
    };
};

const cardClass =
    "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(Number(value));

const formatDate = (value: string) =>
    value.slice(0, 10).split("-").reverse().join("/");

// Importe de la línea sin descuento
const bruto = (i: Item) => i.cantidad * Number(i.precio_unitario);

export default function MiCuentaPedido() {
    const { pedido } = usePage<PageProps>().props;

    const cantidadTotal = pedido.items.reduce((acc, i) => acc + i.cantidad, 0);
    const ahorro = pedido.items.reduce(
        (acc, i) => acc + (bruto(i) - Number(i.subtotal)),
        0,
    );

    return (
        <>
            <Head title={`Pedido #${pedido.id}`} />

            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                                <ShoppingBag className="size-5" />
                            </span>
                            Tienda online
                        </Link>
                        <Link
                            href="/mi-cuenta"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                        >
                            <ArrowLeft className="size-4" />
                            <span className="hidden sm:inline">
                                Volver a mi cuenta
                            </span>
                            <span className="sm:hidden">Volver</span>
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
                    {/* Banner del pedido */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
                        <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -right-4 -bottom-16 size-40 rounded-full bg-white/10" />
                        <div className="relative flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/40 backdrop-blur">
                                    <Package className="size-7" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                        Pedido #{pedido.id}
                                    </h1>
                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-indigo-100">
                                        <CalendarDays className="size-4" />
                                        {formatDate(pedido.fecha)}
                                    </p>
                                </div>
                            </div>

                            {pedido.pagado ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                                    <CheckCircle2 className="size-4" />
                                    Pagado
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-semibold text-amber-700 shadow-sm">
                                    <Clock className="size-4" />
                                    Pendiente de pago
                                </span>
                            )}
                        </div>
                    </section>

                    {/* Detalle */}
                    <section className={`${cardClass} overflow-hidden`}>
                        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                                <ShoppingBag className="size-4" />
                            </span>
                            <h2 className="text-lg font-semibold">
                                Detalle del pedido
                            </h2>
                            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                {cantidadTotal}{" "}
                                {cantidadTotal === 1 ? "unidad" : "unidades"}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-xs tracking-wide text-slate-500 uppercase dark:bg-slate-800/50 dark:text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">
                                            Producto
                                        </th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            Cant.
                                        </th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            Precio
                                        </th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            Desc.
                                        </th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedido.items.map((i) => (
                                        <tr
                                            key={i.id}
                                            className="border-b border-slate-100 transition last:border-0 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-indigo-950/30"
                                        >
                                            <td className="px-5 py-4 font-medium">
                                                {i.producto}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className="inline-block min-w-8 rounded-md bg-slate-100 px-2 py-0.5 text-center text-xs font-semibold dark:bg-slate-800">
                                                    {i.cantidad}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-300">
                                                {formatPrice(i.precio_unitario)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                {i.descuento > 0 ? (
                                                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                                        -{i.descuento}%
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-600">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                {i.descuento > 0 && (
                                                    <p className="text-xs text-slate-400 line-through">
                                                        {formatPrice(bruto(i))}
                                                    </p>
                                                )}
                                                <p className="font-medium">
                                                    {formatPrice(i.subtotal)}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-indigo-50 to-violet-50 px-5 py-4 dark:from-indigo-950/50 dark:to-violet-950/50">
                            <div>
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    Total
                                </span>
                                {ahorro > 0.005 && (
                                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        Ahorraste {formatPrice(ahorro)} con
                                        descuentos
                                    </p>
                                )}
                            </div>
                            <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                {formatPrice(pedido.total)}
                            </span>
                        </div>
                    </section>

                    {/* Nota */}
                    {pedido.nota && (
                        <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
                            <StickyNote className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                                    Nota
                                </p>
                                <p className="mt-0.5 text-amber-900 dark:text-amber-100">
                                    {pedido.nota}
                                </p>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
}