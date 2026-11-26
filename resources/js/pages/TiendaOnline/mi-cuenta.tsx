import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock,
    LogOut,
    Mail,
    MapPin,
    Package,
    Pencil,
    Phone,
    Save,
    ShoppingBag,
    X,
} from "lucide-react";
import { useState } from "react";

type Pedido = {
    id: number;
    fecha: string;
    total: number | string;
    pagado: boolean;
    nota: string | null;
};

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

const DIAS = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
];

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900";

const labelClass =
    "mb-1 block text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400";

const cardClass =
    "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(Number(value));

const formatDate = (value: string) =>
    value.slice(0, 10).split("-").reverse().join("/");

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const iniciales = (nombre: string) =>
    nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join("");

function Dato({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    tone: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div
                className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
            >
                <Icon className="size-5" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                    {label}
                </p>
                <p className="mt-0.5 text-sm font-medium break-words">
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}

function Error({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{message}</p>;
}

export default function MiCuenta() {
    const { cliente, pedidos, filtros } = usePage<PageProps>().props;

    const [desde, setDesde] = useState(filtros.desde);
    const [hasta, setHasta] = useState(filtros.hasta);
    const hayFiltro = Boolean(filtros.desde || filtros.hasta);

    // Edición de datos del cliente
    const [editando, setEditando] = useState(false);
    const form = useForm({
        nombre: cliente?.nombre ?? "",
        direccion: cliente?.direccion ?? "",
        celular: cliente?.celular ?? "",
        dia: cliente?.dia ?? "",
    });

    const empezarEdicion = () => {
        if (!cliente) return;
        form.setData({
            nombre: cliente.nombre,
            direccion: cliente.direccion,
            celular: cliente.celular,
            dia: cliente.dia,
        });
        form.clearErrors();
        setEditando(true);
    };

    const cancelarEdicion = () => {
        form.clearErrors();
        setEditando(false);
    };

    const guardar = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch("/mi-cuenta/datos", {
            preserveScroll: true,
            onSuccess: () => setEditando(false),
        });
    };

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
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                            >
                                <ArrowLeft className="size-4" />
                                <span className="hidden sm:inline">
                                    Seguir comprando
                                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => router.post("/logout")}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950 dark:hover:text-rose-400"
                            >
                                <LogOut className="size-4" />
                                <span className="hidden sm:inline">
                                    Cerrar sesión
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
                    {/* Banner de perfil */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
                        <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -right-4 -bottom-16 size-40 rounded-full bg-white/10" />
                        <div className="relative flex items-center gap-4">
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-semibold ring-2 ring-white/40 backdrop-blur">
                                {cliente ? iniciales(cliente.nombre) : "?"}
                            </div>
                            <div>
                                <p className="text-sm text-indigo-100">
                                    Bienvenido/a
                                </p>
                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    {cliente ? cliente.nombre : "Mi cuenta"}
                                </h1>
                            </div>
                        </div>
                    </section>

                    {/* Datos */}
                    <section className={`${cardClass} p-6`}>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold">
                                Mis datos
                            </h2>
                            {cliente && !editando && (
                                <button
                                    type="button"
                                    onClick={empezarEdicion}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                                >
                                    <Pencil className="size-4" />
                                    Editar
                                </button>
                            )}
                        </div>

                        {cliente && editando ? (
                            <form onSubmit={guardar} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="nombre" className={labelClass}>
                                            Nombre
                                        </label>
                                        <input
                                            id="nombre"
                                            type="text"
                                            required
                                            className={inputClass}
                                            value={form.data.nombre}
                                            onChange={(e) =>
                                                form.setData("nombre", e.target.value)
                                            }
                                        />
                                        <Error message={form.errors.nombre} />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className={labelClass}>
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            disabled
                                            className={`${inputClass} cursor-not-allowed opacity-60`}
                                            value={cliente.email}
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="celular" className={labelClass}>
                                            Celular
                                        </label>
                                        <input
                                            id="celular"
                                            type="tel"
                                            required
                                            className={inputClass}
                                            value={form.data.celular}
                                            onChange={(e) =>
                                                form.setData("celular", e.target.value)
                                            }
                                        />
                                        <Error message={form.errors.celular} />
                                    </div>

                                    <div>
                                        <label htmlFor="dia" className={labelClass}>
                                            Día de entrega
                                        </label>
                                        <select
                                            id="dia"
                                            required
                                            className={inputClass}
                                            value={form.data.dia}
                                            onChange={(e) =>
                                                form.setData("dia", e.target.value)
                                            }
                                        >
                                            <option value="" disabled>
                                                Elegí un día
                                            </option>
                                            {DIAS.map((d) => (
                                                <option key={d} value={d}>
                                                    {capitalize(d)}
                                                </option>
                                            ))}
                                        </select>
                                        <Error message={form.errors.dia} />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="direccion" className={labelClass}>
                                            Dirección
                                        </label>
                                        <input
                                            id="direccion"
                                            type="text"
                                            required
                                            className={inputClass}
                                            value={form.data.direccion}
                                            onChange={(e) =>
                                                form.setData("direccion", e.target.value)
                                            }
                                        />
                                        <Error message={form.errors.direccion} />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={cancelarEdicion}
                                        disabled={form.processing}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <X className="size-4" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                                    >
                                        <Save className="size-4" />
                                        {form.processing ? "Guardando..." : "Guardar cambios"}
                                    </button>
                                </div>
                            </form>
                        ) : cliente ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Dato
                                    icon={Mail}
                                    label="Email"
                                    value={cliente.email}
                                    tone="bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                                />
                                <Dato
                                    icon={Phone}
                                    label="Celular"
                                    value={cliente.celular}
                                    tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                                />
                                <Dato
                                    icon={MapPin}
                                    label="Dirección"
                                    value={cliente.direccion}
                                    tone="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                                />
                                <Dato
                                    icon={CalendarDays}
                                    label="Día de entrega"
                                    value={
                                        cliente.dia
                                            ? capitalize(cliente.dia)
                                            : ""
                                    }
                                    tone="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                                />
                            </div>
                        ) : (
                            <p className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                Todavía no cargaste tus datos. Se completan con
                                tu primera compra.
                            </p>
                        )}
                    </section>

                    {/* Pedidos */}
                    <section>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                                <Package className="size-4" />
                            </span>
                            <h2 className="text-lg font-semibold">
                                Mis pedidos
                            </h2>
                            {pedidos.length > 0 && (
                                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    {pedidos.length}
                                </span>
                            )}
                        </div>

                        {/* Filtros */}
                        <form
                            onSubmit={filtrar}
                            className={`${cardClass} mb-4 grid gap-3 p-4 text-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end`}
                        >
                            <div>
                                <label className={labelClass}>Desde</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={desde}
                                    max={hasta || undefined}
                                    onChange={(e) => setDesde(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Hasta</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={hasta}
                                    min={desde || undefined}
                                    onChange={(e) => setHasta(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    Filtrar
                                </button>
                                {hayFiltro && (
                                    <button
                                        type="button"
                                        onClick={limpiar}
                                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <X className="size-4" />
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </form>

                        {pedidos.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-indigo-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
                                    <ShoppingBag className="size-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <p className="mb-5 text-slate-500 dark:text-slate-400">
                                    {hayFiltro
                                        ? "No hay pedidos en ese rango de fechas."
                                        : "Todavía no hiciste ningún pedido."}
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    Ver productos
                                </Link>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {pedidos.map((p) => (
                                    <li key={p.id}>
                                        <Link
                                            href={`/mi-cuenta/pedidos/${p.id}`}
                                            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
                                        >
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950">
                                                <Package className="size-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold">
                                                    Pedido #{p.id}
                                                </p>
                                                <p className="text-slate-500 dark:text-slate-400">
                                                    {formatDate(p.fecha)}
                                                </p>
                                                {p.nota && (
                                                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                                        Nota: {p.nota}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5">
                                                <p className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
                                                    {formatPrice(p.total)}
                                                </p>
                                                {p.pagado ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                                        <CheckCircle2 className="size-3.5" />
                                                        Pagado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                                                        <Clock className="size-3.5" />
                                                        Pendiente de pago
                                                    </span>
                                                )}
                                            </div>

                                            <ChevronRight className="size-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                                        </Link>
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