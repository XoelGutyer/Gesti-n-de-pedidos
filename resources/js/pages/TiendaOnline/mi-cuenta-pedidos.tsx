import { Head, Link, usePage } from "@inertiajs/react";

type Item = {
    id: number;
    producto: string;
    cantidad: number;
    precio_unitario: number | string;
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

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(Number(value));

const formatDate = (value: string) =>
    value.slice(0, 10).split("-").reverse().join("/");

export default function MiCuentaPedido() {
    const { pedido } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Pedido #${pedido.id}`} />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="border-b border-[#e5e5e0] dark:border-[#3E3E3A]">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <Link href="/" className="text-lg font-semibold">
                            🛍️ Tienda online
                        </Link>
                        <Link href="/mi-cuenta" className="text-sm hover:underline">
                            ← Volver a mi cuenta
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h1 className="text-2xl font-semibold">
                                Pedido #{pedido.id}
                            </h1>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {formatDate(pedido.fecha)}
                            </p>
                        </div>
                        <span
                            className={
                                pedido.pagado
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-[#706f6c] dark:text-[#A1A09A]"
                            }
                        >
                            {pedido.pagado ? "Pagado" : "Pendiente de pago"}
                        </span>
                    </div>

                    <section className="overflow-hidden rounded-xl border border-[#e5e5e0] bg-white dark:border-[#3E3E3A] dark:bg-[#161615]">
                        <table className="w-full text-sm">
                            <thead className="border-b border-[#e5e5e0] text-left text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Producto</th>
                                    <th className="px-4 py-3 text-right font-medium">Cant.</th>
                                    <th className="px-4 py-3 text-right font-medium">Precio</th>
                                    <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.items.map((i) => (
                                    <tr
                                        key={i.id}
                                        className="border-b border-[#e5e5e0] last:border-0 dark:border-[#3E3E3A]"
                                    >
                                        <td className="px-4 py-3">{i.producto}</td>
                                        <td className="px-4 py-3 text-right">{i.cantidad}</td>
                                        <td className="px-4 py-3 text-right">
                                            {formatPrice(i.precio_unitario)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {formatPrice(i.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-[#e5e5e0] font-semibold dark:border-[#3E3E3A]">
                                    <td colSpan={3} className="px-4 py-3 text-right">
                                        Total
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {formatPrice(pedido.total)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>

                    {pedido.nota && (
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            Nota: {pedido.nota}
                        </p>
                    )}
                </main>
            </div>
        </>
    );
}