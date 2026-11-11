import { Head, Link, router, usePage } from "@inertiajs/react";

type Pedido = {
    id: number;
    fecha: string;
    total: number | string;
    pagado: boolean;
    nota: string | null;
};

import { useState } from "react";

type PageProps = {
     cliente: {
        nombre: string;
        email: string;
        direccion: string;
        celular: string;
        dia: string;
    } | null;
    pedidos: Pedido[];
    filtros: { desde: string; hasta: string };
};

const inputClass =
    "rounded-md border border-[#1b1b1835] bg-white px-3 py-2 text-sm outline-none focus:border-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:border-[#eeeeec]";

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(Number(value));

const formatDate = (value: string) =>
    value.slice(0, 10).split("-").reverse().join("/");

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function MiCuenta() {

const { cliente, pedidos, filtros } = usePage<PageProps>().props;

const [desde, setDesde] = useState(filtros.desde);
const [hasta, setHasta] = useState(filtros.hasta);
const hayFiltro = Boolean(filtros.desde || filtros.hasta);

const aplicar = (d: string, h: string) => {
    const params: Record<string, string> = {};
    if (d) params.desde = d;
    if (h) params.hasta = h;

    router.get("/mi-cuenta", params, {
        preserveScroll: true,
        replace: true,
    });
};

const filtrar = (e: React.FormEvent) => {
    e.preventDefault();
    aplicar(desde, hasta);
};

const limpiar = () => {
    setDesde("");
    setHasta("");
    aplicar("", "");
};


    return (
        <>
            <Head title="Mi cuenta" />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="border-b border-[#e5e5e0] dark:border-[#3E3E3A]">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <Link href="/" className="text-lg font-semibold">
                            🛍️ Tienda online
                        </Link>
                        <div className="flex items-center gap-4 text-sm">
                            <Link href="/" className="hover:underline">
                                ← Seguir comprando
                            </Link>
                            <button
                                type="button"
                                onClick={() => router.post("/logout")}
                                className="text-[#706f6c] hover:underline dark:text-[#A1A09A]"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
                    <h1 className="text-2xl font-semibold">Mi cuenta</h1>

                    {/* Datos */}
                    <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#161615]">
                        <h2 className="mb-4 text-lg font-semibold">
                            Mis datos
                        </h2>

                        {cliente ? (
                            <dl className="grid gap-4 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Nombre
                                    </dt>
                                    <dd>{cliente.nombre}</dd>
                                </div>
                                <div>
                                    <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Email
                                    </dt>
                                    <dd>{cliente.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Celular
                                    </dt>
                                    <dd>{cliente.celular}</dd>
                                </div>
                                <div>
                                    <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Dirección
                                    </dt>
                                    <dd>{cliente.direccion}</dd>
                                </div>
                                <div>
                                    <dt className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Día de entrega
                                    </dt>
                                    <dd>
                                        {cliente.dia
                                            ? capitalize(cliente.dia)
                                            : "-"}
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Todavía no cargaste tus datos. Se completan con
                                tu primera compra.
                            </p>
                        )}
                    </section>

                    {/* Pedidos */}
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">
                            Mis pedidos
                        </h2>

                        <form
    onSubmit={filtrar}
    className="mb-4 flex flex-wrap items-end gap-3 text-sm"
>
    <div>
        <label className="mb-1 block font-medium">Desde</label>
        <input
            type="date"
            className={inputClass}
            value={desde}
            max={hasta || undefined}
            onChange={(e) => setDesde(e.target.value)}
        />
    </div>
    <div>
        <label className="mb-1 block font-medium">Hasta</label>
        <input
            type="date"
            className={inputClass}
            value={hasta}
            min={desde || undefined}
            onChange={(e) => setHasta(e.target.value)}
        />
    </div>
    <button
        type="submit"
        className="rounded-md bg-[#1b1b18] px-4 py-2 font-medium text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]"
    >
        Filtrar
    </button>
    {hayFiltro && (
        <button
            type="button"
            onClick={limpiar}
            className="px-2 py-2 text-[#706f6c] hover:underline dark:text-[#A1A09A]"
        >
            Limpiar
        </button>
    )}
</form>

                        {pedidos.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#e5e5e0] p-10 text-center dark:border-[#3E3E3A]">
                                <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                                    Todavía no hiciste ningún pedido.
                                </p>
                                <Link
                                    href="/"
                                    className="rounded-md bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]"
                                >
                                    Ver productos
                                </Link>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {pedidos.map((p) => (
                                    <li
                                        key={p.id}
                                        className="flex items-center justify-between rounded-xl border border-[#e5e5e0] bg-white p-4 text-sm dark:border-[#3E3E3A] dark:bg-[#161615]"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                Pedido #{p.id}
                                            </p>
                                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                                {formatDate(p.fecha)}
                                            </p>
                                            {p.nota && (
                                                <p className="mt-1 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                    Nota: {p.nota}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {formatPrice(p.total)}
                                            </p>
                                            <p
                                                className={
                                                    p.pagado
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-[#706f6c] dark:text-[#A1A09A]"
                                                }
                                            >
                                                {p.pagado
                                                    ? "Pagado"
                                                    : "Pendiente de pago"}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}
