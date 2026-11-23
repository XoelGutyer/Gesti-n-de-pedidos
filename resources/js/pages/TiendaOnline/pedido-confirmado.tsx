import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

type Detalle = {
    id: number;
    nombre: string | null;
    cantidad: number;
    precio: number | string;
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

    const confirmando = !pedido.pagado && (pago === 'success' || pago === 'pending');
    const rechazado = !pedido.pagado && pago === 'failure';

    const icono = pedido.pagado ? '✅' : confirmando ? '⏳' : rechazado ? '❌' : '🧾';
    const titulo = pedido.pagado
        ? '¡Pago recibido!'
        : confirmando
          ? '¡Pedido recibido!'
          : rechazado
            ? 'El pago no se completó'
            : 'Pedido pendiente de pago';

    return (
        <>
            <Head title={`Pedido #${pedido.id}`} />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <main className="mx-auto max-w-2xl px-6 py-12">
                    <div className="mb-8 text-center">
                        <div className="mb-3 text-5xl">{icono}</div>
                        <h1 className="text-2xl font-semibold">{titulo}</h1>
                        <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            Pedido #{pedido.id} · {pedido.fecha}
                        </p>

                        {confirmando && (
                            <p className="mt-3 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Estamos confirmando tu pago, puede tardar unos
                                minutos. Actualizá la página para ver el estado.
                            </p>
                        )}

                        {error && (
                            <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-[#e5e5e0] bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#161615]">
                        <dl className="mb-6 space-y-1 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                    Cliente
                                </dt>
                                <dd>{pedido.cliente}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                    Dirección
                                </dt>
                                <dd className="text-right">{pedido.direccion}</dd>
                            </div>
                            {pedido.nota && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Nota
                                    </dt>
                                    <dd className="text-right">{pedido.nota}</dd>
                                </div>
                            )}
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                    Pago
                                </dt>
                                <dd>
                                    {pedido.pagado
                                        ? 'Pagado'
                                        : confirmando
                                          ? 'Confirmando'
                                          : 'Pendiente'}
                                </dd>
                            </div>
                        </dl>

                        <ul className="space-y-3 border-t border-[#e5e5e0] pt-4 text-sm dark:border-[#3E3E3A]">
                            {pedido.detalles.map((d) => (
                                <li
                                    key={d.id}
                                    className="flex justify-between gap-3"
                                >
                                    <span>
                                        {d.cantidad} × {d.nombre}{' '}
                                        <span className="text-[#706f6c] dark:text-[#A1A09A]">
                                            ({formatPrice(d.precio)} c/u)
                                        </span>
                                    </span>
                                    <span className="shrink-0">
                                        {formatPrice(d.subtotal)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex justify-between border-t border-[#e5e5e0] pt-4 text-lg font-semibold dark:border-[#3E3E3A]">
                            <span>Total</span>
                            <span>{formatPrice(pedido.total)}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-3">
                        {!pedido.pagado && !confirmando && (
                            <button
                                type="button"
                                onClick={() =>
                                    router.post(`/pedidos/${pedido.id}/pagar`)
                                }
                                className="rounded-md bg-[#1b1b18] px-6 py-3 text-sm font-medium text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]"
                            >
                                {rechazado ? 'Reintentar pago' : 'Pagar con Mercado Pago'}
                            </button>
                        )}

                        <Link
                            href="/"
                            className={
                                pedido.pagado || confirmando
                                    ? 'rounded-md bg-[#1b1b18] px-6 py-3 text-sm font-medium text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]'
                                    : 'text-sm text-[#706f6c] hover:underline dark:text-[#A1A09A]'
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