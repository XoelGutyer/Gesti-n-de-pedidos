import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { dashboard, login, register, checkout, miCuenta } from "@/routes";
import { Auth } from "@/types";

type Producto = {
    id: number;
    nombre: string;
    precio: number | string;
    descuento: number | string;
    stock: number;
    imagen?: string | null; // URL pública de la imagen
};

type CartItem = {
    producto: Producto;
    cantidad: number;
};

type PageProps = {
    auth: Auth;
    productos: Producto[];
};

const formatPrice = (value: number | string) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
    }).format(Number(value));

const calcularPrecioFinal = (producto: Producto) => {
    const precio = Number(producto.precio);
    const descuento = Math.min(
        100,
        Math.max(0, Number(producto.descuento ?? 0))
    );

    return precio * (1 - descuento / 100);
};

export default function Welcome() {
    const { auth, productos = [] } = usePage<PageProps>().props;

    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartLoaded, setCartLoaded] = useState(false);

    // Recupera el carrito guardado (sobrevive a recargas y al paso por /checkout)
    useEffect(() => {
        try {
            const saved = localStorage.getItem("carrito");

            if (saved) setCart(JSON.parse(saved));
        } catch {
            // localStorage no disponible: el carrito funciona solo en memoria
        }
        setCartLoaded(true);
    }, []);

    useEffect(() => {
        if (!cartLoaded) return;

        try {
            localStorage.setItem("carrito", JSON.stringify(cart));
        } catch {
            // ignorar
        }
    }, [cart, cartLoaded]);
    const [cartOpen, setCartOpen] = useState(false);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return term === ""
            ? productos
            : productos.filter((p) => p.nombre.toLowerCase().includes(term));
    }, [productos, search]);

const ofertas = useMemo(() => {
    return productos.filter(
        (producto) =>
            Number(producto.descuento ?? 0) > 0 &&
            producto.stock > 0
    );
}, [productos]);

    const cartCount = cart.reduce((sum, i) => sum + i.cantidad, 0);
    const cartTotal = cart.reduce(
        (sum, i) => sum + calcularPrecioFinal(i.producto) * i.cantidad,
        0,
    );

    const addToCart = (producto: Producto) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.producto.id === producto.id);

            if (existing) {
                if (existing.cantidad >= producto.stock) return prev;

                return prev.map((i) =>
                    i.producto.id === producto.id
                        ? { ...i, cantidad: i.cantidad + 1 }
                        : i,
                );
            }

            return [...prev, { producto, cantidad: 1 }];
        });
        setCartOpen(true);
    };

    const changeQuantity = (id: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((i) =>
                    i.producto.id === id
                        ? {
                              ...i,
                              cantidad: Math.min(
                                  i.cantidad + delta,
                                  i.producto.stock,
                              ),
                          }
                        : i,
                )
                .filter((i) => i.cantidad > 0),
        );
    };

    const removeFromCart = (id: number) =>
        setCart((prev) => prev.filter((i) => i.producto.id !== id));

    const btnPrimary =
        "rounded-md bg-[#1b1b18] px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white";
    const btnOutline =
        "rounded-md border border-[#1b1b1835] px-4 py-2 text-sm font-medium transition hover:bg-[#f5f5f2] dark:border-[#3E3E3A] dark:hover:bg-[#161615]";

    return (
        <>
            <Head title="Tienda online" />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-[#e5e5e0] bg-[#FDFDFC]/90 backdrop-blur dark:border-[#3E3E3A] dark:bg-[#0a0a0a]/90">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-12">
                        <Link href="/" className="text-lg font-semibold">
                            🛍️ Tienda online
                        </Link>

                        <div className="hidden flex-1 md:block md:max-w-md">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar productos..."
                                className="w-full rounded-md border border-[#1b1b1835] bg-white px-4 py-2 text-sm outline-none focus:border-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:border-[#eeeeec]"
                            />
                        </div>

                        <nav className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setCartOpen(true)}
                                className={`relative ${btnOutline}`}
                            >
                                🛒 Carrito
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1b1b18] px-1 text-xs text-white dark:bg-[#eeeeec] dark:text-[#1C1C1A]">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {auth.user ? (
                                <Link
                                    href={
                                        auth.user.role === "admin"
                                            ? dashboard()
                                            : miCuenta()
                                    }
                                    className={btnPrimary}
                                >
                                    {auth.user.role === "admin"
                                        ? "Panel"
                                        : "Mi cuenta"}
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className={btnOutline}>
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href={register()}
                                        className={`hidden sm:block ${btnPrimary}`}
                                    >
                                        Registrarme
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="px-6 pb-4 md:hidden">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar productos..."
                            className="w-full rounded-md border border-[#1b1b1835] bg-white px-4 py-2 text-sm outline-none dark:border-[#3E3E3A] dark:bg-[#161615]"
                        />
                    </div>
                </header>

                {/* Catálogo */}
                <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 lg:px-12">


{/* Carrusel de ofertas */}
{ofertas.length > 0 && (
    <section className="mb-14">
        <div className="mb-6">
            <span className="text-sm font-bold uppercase tracking-widest text-red-500">
                Ofertas especiales
            </span>
            <h2 className="mt-2 text-3xl font-extrabold">
                🔥 Aprovechá nuestros descuentos
            </h2>
            <p className="mt-2 text-sm text-gray-500">
                Encontrá tus productos favoritos a precios increíbles.
            </p>
        </div>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-5">
            {ofertas.map((producto) => (
                <article
                    key={producto.id}
                    className="group w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-[#161615]"
                >
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                        {producto.imagen ? (
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-6xl">
                                📦
                            </div>
                        )}

                        <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                            -{Number(producto.descuento)}%
                        </span>
                    </div>

                    <div className="p-4">
                        <h3 className="truncate font-semibold">
                            {producto.nombre}
                        </h3>

                        <p className="mt-2 text-sm text-gray-400 line-through">
                            {formatPrice(producto.precio)}
                        </p>

                        <p className="text-2xl font-extrabold text-emerald-600">
                            {formatPrice(calcularPrecioFinal(producto))}
                        </p>

                        <button
                            type="button"
                            onClick={() => addToCart(producto)}
                            className="mt-4 w-full rounded-xl bg-indigo-950 px-4 py-3 font-semibold text-white transition hover:bg-indigo-800 dark:bg-indigo-600"
                        >
                            Agregar al carrito →
                        </button>
                    </div>
                </article>
            ))}
        </div>
    </section>
)}


                    <h1 className="mb-6 text-2xl font-semibold">Productos</h1>

                    {filtered.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#e5e5e0] p-12 text-center text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                            No se encontraron productos.
                        </div>
                    ) : (
                        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((producto) => {
                                const sinStock = producto.stock <= 0;

                                return (
                                    <article
                                        key={producto.id}
                                        className="flex flex-col overflow-hidden rounded-xl border border-[#e5e5e0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#161615]"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-[#f3f3ef] dark:bg-[#252523]">
                                            {producto.imagen ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    loading="lazy"
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="absolute inset-0 flex items-center justify-center text-5xl">
                                                    📦
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            <h2 className="mb-1 text-base font-semibold">
                                                {producto.nombre}
                                            </h2>

                                            {!sinStock &&
                                                producto.stock <= 5 && (
                                                    <p className="text-xs text-amber-600">
                                                        ¡Últimas{" "}
                                                        {producto.stock}{" "}
                                                        unidades!
                                                    </p>
                                                )}

                                            <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                                                <div className="flex flex-col">
    {Number(producto.descuento) > 0 && (
        <>
            <span className="text-xs font-bold text-red-500">
                -{Number(producto.descuento)}% OFF
            </span>

            <span className="text-sm text-gray-400 line-through">
                {formatPrice(producto.precio)}
            </span>
        </>
    )}

    <span className="text-xl font-bold text-emerald-600">
        {formatPrice(calcularPrecioFinal(producto))}
    </span>
</div>

                                                <button
                                                    type="button"
                                                    disabled={sinStock}
                                                    onClick={() =>
                                                        addToCart(producto)
                                                    }
                                                    className={btnPrimary}
                                                >
                                                    {sinStock
                                                        ? "Sin stock"
                                                        : "Agregar"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                    )}
                </main>

                <footer className="border-t border-[#e5e5e0] px-6 py-6 text-center text-xs text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                    Tienda online · Todos los derechos reservados
                </footer>

                {/* Carrito lateral */}
                {cartOpen && (
                    <div className="fixed inset-0 z-40 flex justify-end">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setCartOpen(false)}
                        />

                        <aside className="relative flex h-full w-full max-w-md flex-col bg-[#FDFDFC] shadow-xl dark:bg-[#0a0a0a]">
                            <div className="flex items-center justify-between border-b border-[#e5e5e0] px-6 py-4 dark:border-[#3E3E3A]">
                                <h2 className="text-lg font-semibold">
                                    Tu carrito
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setCartOpen(false)}
                                    className="rounded-md px-2 py-1 text-xl hover:bg-[#f5f5f2] dark:hover:bg-[#161615]"
                                    aria-label="Cerrar carrito"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {cart.length === 0 ? (
                                    <p className="py-12 text-center text-[#706f6c] dark:text-[#A1A09A]">
                                        Tu carrito está vacío.
                                    </p>
                                ) : (
                                    <ul className="space-y-4">
                                        {cart.map(({ producto, cantidad }) => (
                                            <li
                                                key={producto.id}
                                                className="flex gap-3"
                                            >
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f3f3ef] dark:bg-[#252523]">
                                                    {producto.imagen ? (
                                                        <img
                                                            src={
                                                                producto.imagen
                                                            }
                                                            alt={
                                                                producto.nombre
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>📦</span>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {producto.nombre}
                                                    </p>
                                                    <div className="text-sm">
    {Number(producto.descuento ?? 0) > 0 && (
        <p className="text-xs text-gray-400 line-through">
            {formatPrice(producto.precio)}
        </p>
    )}

    <p className="font-semibold text-emerald-600">
        {formatPrice(calcularPrecioFinal(producto))}
    </p>
</div>

                                                    <div className="mt-2 flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                changeQuantity(
                                                                    producto.id,
                                                                    -1,
                                                                )
                                                            }
                                                            className="h-7 w-7 rounded border border-[#1b1b1835] text-sm dark:border-[#3E3E3A]"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-6 text-center text-sm">
                                                            {cantidad}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                changeQuantity(
                                                                    producto.id,
                                                                    1,
                                                                )
                                                            }
                                                            className="h-7 w-7 rounded border border-[#1b1b1835] text-sm dark:border-[#3E3E3A]"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    producto.id,
                                                                )
                                                            }
                                                            className="ml-auto text-xs text-red-600 hover:underline"
                                                        >
                                                            Quitar
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="border-t border-[#e5e5e0] px-6 py-4 dark:border-[#3E3E3A]">
                                    <div className="mb-4 flex items-center justify-between text-base font-semibold">
                                        <span>Total</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>

                                    {/* TODO: reemplazar por la ruta real de checkout */}
                                    <Link
                                        href={auth.user ? checkout() : login()}
                                        className={`block w-full text-center ${btnPrimary}`}
                                    >
                                        {auth.user
                                            ? "Finalizar compra"
                                            : "Inicia sesión para comprar"}
                                    </Link>
                                </div>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </>
    );
}
