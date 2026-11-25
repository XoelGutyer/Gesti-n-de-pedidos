import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, ShoppingBag, Tag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type CartItem = {
    producto: {
        id: number;
        nombre: string;
        precio: number | string;
        descuento: number | string;
        stock: number;
        imagen?: string | null;
    };
    cantidad: number;
};

type PageProps = {
    cliente: {
        nombre: string;
        email: string;
        direccion: string;
        celular: string;
        dia: string;
    };
    dias: string[];
};

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 2,
    }).format(Number(value));

const descuentoDe = (producto: CartItem['producto']) =>
    Math.min(100, Math.max(0, Number(producto.descuento ?? 0)));

const calcularPrecioFinal = (producto: CartItem['producto']) =>
    Number(producto.precio) * (1 - descuentoDe(producto) / 100);

// Se redondea por línea, igual que hace el servidor
const subtotalLinea = (producto: CartItem['producto'], cantidad: number) =>
    Math.round(calcularPrecioFinal(producto) * cantidad * 100) / 100;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const inputClass =
    'w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm text-slate-900 ' +
    'placeholder:text-slate-400 outline-none transition ' +
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 ' +
    'dark:border-blue-900 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400';

const labelClass = 'mb-1.5 block text-sm font-medium text-blue-900 dark:text-blue-200';

const cardClass =
    'rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/50 dark:bg-slate-900';

function Campo({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export default function Checkout() {
    const { cliente, dias } = usePage<PageProps>().props;

    const [cart, setCart] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    const form = useForm({
        nombre: cliente.nombre,
        email: cliente.email,
        direccion: cliente.direccion,
        celular: cliente.celular,
        dia: cliente.dia,
        nota: '',
    });

    useEffect(() => {
        try {
            const saved = localStorage.getItem('carrito');

            if (saved) setCart(JSON.parse(saved));
        } catch {
            // sin carrito guardado
        }
        setLoaded(true);
    }, []);

    const total = cart.reduce((sum, i) => sum + subtotalLinea(i.producto, i.cantidad), 0);
    const sinDescuento = cart.reduce((sum, i) => sum + Number(i.producto.precio) * i.cantidad, 0);
    const ahorro = Math.max(0, Math.round((sinDescuento - total) * 100) / 100);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Solo se envían id y cantidad: el servidor calcula precios y valida stock
        form.transform((data) => ({
            ...data,
            items: cart.map((i) => ({
                id: i.producto.id,
                cantidad: i.cantidad,
            })),
        }));

        form.post('/checkout', {
            onSuccess: () => {
                try {
                    localStorage.removeItem('carrito');
                } catch {
                    // ignorar
                }
            },
        });
    };

    const errors = form.errors as Record<string, string>;
    const itemsError = Object.entries(errors).find(([k]) => k.startsWith('items'))?.[1];

    return (
        <>
            <Head title="Finalizar compra" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
                {/* Header */}
                <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                            <ShoppingBag className="size-5" />
                            Tienda online
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-sm text-blue-100 transition hover:text-white"
                        >
                            <ArrowLeft className="size-4" /> Seguir comprando
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-6 py-8">
                    <h1 className="mb-1 text-3xl font-bold text-blue-950 dark:text-white">Finalizar compra</h1>
                    <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                        Completá tus datos y confirmá el pedido. Es el último paso.
                    </p>

                    {loaded && cart.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-14 text-center dark:border-blue-900 dark:bg-slate-900">
                            <ShoppingBag className="mx-auto mb-3 size-10 text-blue-300 dark:text-blue-800" />
                            <p className="mb-5 text-slate-500 dark:text-slate-400">Tu carrito está vacío.</p>
                            <Link
                                href="/"
                                className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                Ver productos
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="grid gap-8 md:grid-cols-5">
                            {/* Datos de entrega */}
                            <section className={`space-y-5 md:col-span-3 ${cardClass}`}>
                                <div className="flex items-center gap-3">
                                    <span className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-white">
                                        <Truck className="size-4" />
                                    </span>
                                    <h2 className="text-lg font-semibold text-blue-950 dark:text-white">
                                        Datos de entrega
                                    </h2>
                                </div>

                                {itemsError && (
                                    <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                                        {itemsError}
                                    </div>
                                )}

                                <Campo label="Nombre" error={form.errors.nombre}>
                                    <input
                                        className={inputClass}
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                    />
                                </Campo>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Campo label="Email" error={form.errors.email}>
                                        <input
                                            type="email"
                                            className={inputClass}
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                        />
                                    </Campo>

                                    <Campo label="Celular" error={form.errors.celular}>
                                        <input
                                            className={inputClass}
                                            value={form.data.celular}
                                            onChange={(e) => form.setData('celular', e.target.value)}
                                        />
                                    </Campo>
                                </div>

                                <Campo label="Dirección de entrega" error={form.errors.direccion}>
                                    <input
                                        className={inputClass}
                                        value={form.data.direccion}
                                        onChange={(e) => form.setData('direccion', e.target.value)}
                                    />
                                </Campo>

                                <Campo label="Día preferido de entrega" error={form.errors.dia}>
                                    <select
                                        className={inputClass}
                                        value={form.data.dia}
                                        onChange={(e) => form.setData('dia', e.target.value)}
                                    >
                                        <option value="">Elegí un día</option>
                                        {dias.map((d) => (
                                            <option key={d} value={d}>
                                                {capitalize(d)}
                                            </option>
                                        ))}
                                    </select>
                                </Campo>

                                <Campo label="Nota (opcional)">
                                    <textarea
                                        rows={3}
                                        className={inputClass}
                                        placeholder="Ej: tocar timbre dos veces"
                                        value={form.data.nota}
                                        onChange={(e) => form.setData('nota', e.target.value)}
                                    />
                                </Campo>
                            </section>

                            {/* Resumen */}
                            <aside className="md:col-span-2">
                                <div className="sticky top-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4">
                                        <h2 className="text-lg font-semibold text-white">Tu pedido</h2>
                                    </div>

                                    <div className="p-6">
                                        <ul className="mb-5 divide-y divide-blue-50 text-sm dark:divide-slate-800">
                                            {cart.map(({ producto, cantidad }) => {
                                                const desc = descuentoDe(producto);

                                                return (
                                                    <li key={producto.id} className="flex justify-between gap-3 py-3 first:pt-0">
                                                        <div>
                                                            <p className="font-medium text-slate-800 dark:text-slate-100">
                                                                {producto.nombre}
                                                            </p>
                                                            <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                                Cantidad: {cantidad}
                                                                {desc > 0 && (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                                                        <Tag className="size-3" />-{desc}%
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="shrink-0 text-right">
                                                            {desc > 0 && (
                                                                <p className="text-xs text-slate-400 line-through tabular-nums">
                                                                    {formatPrice(Number(producto.precio) * cantidad)}
                                                                </p>
                                                            )}
                                                            <p className="font-semibold text-blue-700 tabular-nums dark:text-blue-300">
                                                                {formatPrice(subtotalLinea(producto, cantidad))}
                                                            </p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        <div className="space-y-2 border-t border-blue-100 pt-4 text-sm dark:border-blue-900/50">
                                            {ahorro > 0 && (
                                                <>
                                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                                        <span>Subtotal</span>
                                                        <span className="tabular-nums">{formatPrice(sinDescuento)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-medium text-sky-600 dark:text-sky-400">
                                                        <span>Descuentos</span>
                                                        <span className="tabular-nums">-{formatPrice(ahorro)}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex items-baseline justify-between pt-1 text-lg font-bold text-blue-950 dark:text-white">
                                                <span>Total</span>
                                                <span className="tabular-nums">{formatPrice(total)}</span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={form.processing || cart.length === 0}
                                            className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-500"
                                        >
                                            {form.processing ? 'Procesando...' : 'Confirmar pedido'}
                                        </button>

                                        <p className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-blue-500" />
                                            Al confirmar te llevamos a Mercado Pago para pagar. El total final lo
                                            confirma el servidor con los precios actuales.
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
}