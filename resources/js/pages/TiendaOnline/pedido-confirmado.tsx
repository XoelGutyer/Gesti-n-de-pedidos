import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    CreditCard,
    MapPin,
    Receipt,
    ShoppingBag,
    StickyNote,
    User,
    XCircle,
} from 'lucide-react';
import { useEffect } from 'react';

type Detalle = {
    id: number;
    nombre: string | null;
    cantidad: number;
    precio: number | string;
    descuento?: number;
    subtotal: number | string;
};

type PageProps = {
    pedido: {
        id: number;
        fecha: string;
        cliente: string;
        direccion: string;
        nota: string;
        total: number | string;
        pagado: boolean;
        detalles: Detalle[];
    };
    pago?: 'success' | 'pending' | 'failure' | null;
    error?: string | null;
};

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 2,
    }).format(Number(value));

// Importe de la línea sin descuento
const bruto = (d: Detalle) => d.cantidad * Number(d.precio);

const btnPrimary =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700';

function Fila({
    icon: Icon,
    label,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Icon className="size-4" />
                {label}
            </dt>
            <dd className="text-right font-medium">{children}</dd>
        </div>
    );
}

export default function PedidoConfirmado() {
    const { pedido, pago, error } = usePage<PageProps>().props;

    // El pedido ya existe: se vacía el carrito guardado en el navegador
    useEffect(() => {
        try {
            localStorage.removeItem('carrito');
        } catch {
            // ignorar
        }
    }, []);

    const confirmando =
        !pedido.pagado && (pago === 'success' || pago === 'pending');
    const rechazado = !pedido.pagado && pago === 'failure';

    // Ahorro total por descuentos (solo cuenta si el subtotal ya viene con descuento)
    const ahorro = pedido.detalles.reduce(
        (acc, d) => acc + Math.max(bruto(d) - Number(d.subtotal), 0),
        0,
    );

    // Estado visual: color del banner, ícono y textos
    const estado = pedido.pagado
        ? {
              banner: 'from-emerald-500 via-emerald-500 to-teal-500',
              Icon: CheckCircle2,
              titulo: '¡Pago recibido!',
              subtitulo: 'Gracias por tu compra',
              badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
              pagoTexto: 'Pagado',
          }
        : confirmando
          ? {
                banner: 'from-amber-500 via-amber-500 to-orange-500',
                Icon: Clock,
                titulo: '¡Pedido recibido!',
                subtitulo: 'Estamos confirmando tu pago',
                badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                pagoTexto: 'Confirmando',
            }
          : rechazado
            ? {
                  banner: 'from-rose-500 via-rose-500 to-red-500',
                  Icon: XCircle,
                  titulo: 'El pago no se completó',
                  subtitulo: 'Podés intentarlo de nuevo',
                  badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
                  pagoTexto: 'Pendiente',
              }
            : {
                  banner: 'from-indigo-600 via-indigo-600 to-violet-600',
                  Icon: Receipt,
                  titulo: 'Pedido pendiente de pago',
                  subtitulo: 'Completá el pago para confirmarlo',
                  badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
                  pagoTexto: 'Pendiente',
              };

    const EstadoIcon = estado.Icon;

    return (
        <>
            <Head title={`Pedido #${pedido.id}`} />

            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
                <main className="mx-auto max-w-2xl px-6 py-10">
                    {/* Banner de estado */}
                    <section
                        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${estado.banner} p-8 text-center text-white shadow-lg`}
                    >
                        <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -bottom-16 -left-6 size-40 rounded-full bg-white/10" />
                        <div className="relative">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40 backdrop-blur">
                                <EstadoIcon className="size-8" />
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {estado.titulo}
                            </h1>
                            <p className="mt-1 text-sm text-white/90">
                                {estado.subtitulo}
                            </p>
                            <p className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                                Pedido #{pedido.id} · {pedido.fecha}
                            </p>
                        </div>
                    </section>

                    {confirmando && (
                        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                            Estamos confirmando tu pago, puede tardar unos
                            minutos. Actualizá la página para ver el estado.
                        </p>
                    )}

                    {error && (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
                            {error}
                        </div>
                    )}

                    {/* Resumen */}
                    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <dl className="space-y-3 p-6 text-sm">
                            <Fila icon={User} label="Cliente">
                                {pedido.cliente}
                            </Fila>
                            <Fila icon={MapPin} label="Dirección">
                                {pedido.direccion}
                            </Fila>
                            {pedido.nota && (
                                <Fila icon={StickyNote} label="Nota">
                                    {pedido.nota}
                                </Fila>
                            )}
                            <Fila icon={CreditCard} label="Pago">
                                <span
                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${estado.badge}`}
                                >
                                    {estado.pagoTexto}
                                </span>
                            </Fila>
                        </dl>

                        {/* Productos */}
                        <div className="border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 px-6 pt-4 pb-2">
                                <span className="flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                                    <ShoppingBag className="size-4" />
                                </span>
                                <h2 className="text-sm font-semibold">
                                    Productos
                                </h2>
                            </div>
                            <ul className="divide-y divide-slate-100 px-6 pb-2 text-sm dark:divide-slate-800">
                                {pedido.detalles.map((d) => {
                                    const conDescuento =
                                        (d.descuento ?? 0) > 0;
                                    const mostrarTachado =
                                        conDescuento &&
                                        bruto(d) > Number(d.subtotal);

                                    return (
                                        <li
                                            key={d.id}
                                            className="flex items-center justify-between gap-3 py-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                    {d.cantidad}×
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {d.nombre}
                                                    </p>
                                                    <p className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                        {formatPrice(d.precio)}{' '}
                                                        c/u
                                                        {conDescuento && (
                                                            <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                                                -{d.descuento}%
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                {mostrarTachado && (
                                                    <p className="text-xs text-slate-400 line-through">
                                                        {formatPrice(bruto(d))}
                                                    </p>
                                                )}
                                                <p className="font-medium">
                                                    {formatPrice(d.subtotal)}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 dark:from-indigo-950/50 dark:to-violet-950/50">
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

                    {/* Acciones */}
                    <div className="mt-8 flex flex-col items-center gap-3">
                        {!pedido.pagado && !confirmando && (
                            <button
                                type="button"
                                onClick={() =>
                                    router.post(`/pedidos/${pedido.id}/pagar`)
                                }
                                className={btnPrimary}
                            >
                                <CreditCard className="size-4" />
                                {rechazado
                                    ? 'Reintentar pago'
                                    : 'Pagar con Mercado Pago'}
                            </button>
                        )}

                        <Link
                            href="/"
                            className={
                                pedido.pagado || confirmando
                                    ? btnPrimary
                                    : 'text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400'
                            }
                        >
                            Volver a la tienda
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}