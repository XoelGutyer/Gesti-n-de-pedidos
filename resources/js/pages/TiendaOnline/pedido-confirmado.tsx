import { Head, Link, usePage } from '@inertiajs/react';

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
};

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 2,
    }).format(Number(value));

export default function PedidoConfirmado() {
    const { pedido } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Pedido #${pedido.id}`} />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <main className="mx-auto max-w-2xl px-6 py-12">
                    <div className="mb-8 text-center">
                        <div className="mb-3 text-5xl">✅</div>
                        <h1 className="text-2xl font-semibold">
                            ¡Pedido recibido!
                        </h1>
                        <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            Pedido #{pedido.id} · {pedido.fecha}
                        </p>
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
                                <dd>{pedido.pagado ? 'Pagado' : 'Pendiente'}</dd>
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

                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="rounded-md bg-[#1b1b18] px-6 py-3 text-sm font-medium text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]"
                        >
                            Volver a la tienda
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}