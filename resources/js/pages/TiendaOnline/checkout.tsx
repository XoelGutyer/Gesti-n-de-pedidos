import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type CartItem = {
    producto: {
        id: number;
        nombre: string;
        precio: number | string;
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

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const inputClass =
    'w-full rounded-md border border-[#1b1b1835] bg-white px-4 py-2 text-sm outline-none focus:border-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:border-[#eeeeec]';

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

    const total = cart.reduce(
        (sum, i) => sum + Number(i.producto.precio) * i.cantidad,
        0,
    );

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
    const itemsError = Object.entries(errors).find(([k]) =>
        k.startsWith('items'),
    )?.[1];

    return (
        <>
            <Head title="Finalizar compra" />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="border-b border-[#e5e5e0] dark:border-[#3E3E3A]">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <Link href="/" className="text-lg font-semibold">
                            🛍️ Tienda online
                        </Link>
                        <Link
                            href="/"
                            className="text-sm text-[#706f6c] hover:underline dark:text-[#A1A09A]"
                        >
                            ← Seguir comprando
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-6 py-8">
                    <h1 className="mb-6 text-2xl font-semibold">
                        Finalizar compra
                    </h1>

                    {loaded && cart.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#e5e5e0] p-12 text-center dark:border-[#3E3E3A]">
                            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                                Tu carrito está vacío.
                            </p>
                            <Link
                                href="/"
                                className="rounded-md bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]"
                            >
                                Ver productos
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={submit}
                            className="grid gap-8 md:grid-cols-5"
                        >
                            {/* Datos de entrega */}
                            <section className="space-y-4 md:col-span-3">
                                <h2 className="text-lg font-semibold">
                                    Datos de entrega
                                </h2>

                                {itemsError && (
                                    <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                                        {itemsError}
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nombre
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.data.nombre}
                                        onChange={(e) =>
                                            form.setData('nombre', e.target.value)
                                        }
                                    />
                                    {form.errors.nombre && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {form.errors.nombre}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className={inputClass}
                                            value={form.data.email}
                                            onChange={(e) =>
                                                form.setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {form.errors.email && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {form.errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Celular
                                        </label>
                                        <input
                                            className={inputClass}
                                            value={form.data.celular}
                                            onChange={(e) =>
                                                form.setData(
                                                    'celular',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {form.errors.celular && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {form.errors.celular}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Dirección de entrega
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.data.direccion}
                                        onChange={(e) =>
                                            form.setData(
                                                'direccion',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {form.errors.direccion && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {form.errors.direccion}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Día preferido de entrega
                                    </label>
                                    <select
                                        className={inputClass}
                                        value={form.data.dia}
                                        onChange={(e) =>
                                            form.setData('dia', e.target.value)
                                        }
                                    >
                                        <option value="">Elegí un día</option>
                                        {dias.map((d) => (
                                            <option key={d} value={d}>
                                                {capitalize(d)}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.dia && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {form.errors.dia}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nota (opcional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        className={inputClass}
                                        value={form.data.nota}
                                        onChange={(e) =>
                                            form.setData('nota', e.target.value)
                                        }
                                    />
                                </div>
                            </section>

                            {/* Resumen */}
                            <aside className="md:col-span-2">
                                <div className="sticky top-6 rounded-xl border border-[#e5e5e0] bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#161615]">
                                    <h2 className="mb-4 text-lg font-semibold">
                                        Resumen
                                    </h2>

                                    <ul className="mb-4 space-y-3 text-sm">
                                        {cart.map(({ producto, cantidad }) => (
                                            <li
                                                key={producto.id}
                                                className="flex justify-between gap-3"
                                            >
                                                <span>
                                                    {cantidad} × {producto.nombre}
                                                </span>
                                                <span className="shrink-0">
                                                    {formatPrice(
                                                        Number(producto.precio) *
                                                            cantidad,
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mb-5 flex justify-between border-t border-[#e5e5e0] pt-4 text-base font-semibold dark:border-[#3E3E3A]">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            form.processing || cart.length === 0
                                        }
                                        className="w-full rounded-md bg-[#1b1b18] px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50 dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                    >
                                        {form.processing
                                            ? 'Procesando...'
                                            : 'Confirmar pedido'}
                                    </button>

                                    <p className="mt-3 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                        El total final lo confirma el servidor
                                        con los precios actuales.
                                    </p>
                                </div>
                            </aside>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
}