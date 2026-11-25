import { Head, Link, usePage } from "@inertiajs/react";
import {
    Flame,
    Minus,
    Package,
    Plus,
    Search,
    ShoppingBag,
    ShoppingCart,
    Trash2,
    X,
} from "lucide-react";
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

const descuentoDe = (producto: Producto) =>
    Math.min(100, Math.max(0, Number(producto.descuento ?? 0)));

const calcularPrecioFinal = (producto: Producto) =>
    Number(producto.precio) * (1 - descuentoDe(producto) / 100);

// Se redondea por línea, igual que hace el servidor
const subtotalLinea = (producto: Producto, cantidad: number) =>
    Math.round(calcularPrecioFinal(producto) * cantidad * 100) / 100;

// Estilos reutilizables (paleta azul)
const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-blue-500";
const btnHeaderSolid =
    "inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50";
const btnHeaderOutline =
    "relative inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15";
const inputBusqueda =
    "w-full rounded-lg border border-transparent bg-white py-2 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300";

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
                Number(producto.descuento ?? 0) > 0 && producto.stock > 0,
        );
    }, [productos]);

    const cartCount = cart.reduce((sum, i) => sum + i.cantidad, 0);
    const cartTotal = cart.reduce(
        (sum, i) => sum + subtotalLinea(i.producto, i.cantidad),
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

    return (
        <>
            <Head title="Tienda online" />

            <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-12">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-bold"
                        >
                            <ShoppingBag className="size-5" />
                            Tienda online
                        </Link>

                        <div className="relative hidden flex-1 md:block md:max-w-md">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar productos..."
                                className={inputBusqueda}
                            />
                        </div>

                        <nav className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setCartOpen(true)}
                                className={btnHeaderOutline}
                            >
                                <ShoppingCart className="size-4" />
                                Carrito
                                {cartCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-blue-700 ring-2 ring-blue-600">
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
                                    className={btnHeaderSolid}
                                >
                                    {auth.user.role === "admin"
                                        ? "Panel"
                                        : "Mi cuenta"}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className={btnHeaderOutline}
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href={register()}
                                        className={`hidden sm:inline-flex ${btnHeaderSolid}`}
                                    >
                                        Registrarme
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="relative px-6 pb-4 md:hidden">
                        <Search className="absolute left-9 top-1/2 size-4 -translate-y-[70%] text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar productos..."
                            className={inputBusqueda}
                        />
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 lg:px-12">
                    {/* Portada */}
                    <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-8 text-white shadow-lg sm:p-10">
                        <h1 className="text-3xl font-extrabold sm:text-4xl">
                            Tu tienda online
                        </h1>
                        <p className="mt-2 max-w-xl text-blue-100">
                            Elegí tus productos, armá tu carrito y pagá de forma
                            segura con Mercado Pago.
                        </p>
                    </section>

                    {/* Carrusel de ofertas */}
                    {ofertas.length > 0 && (
                        <section className="mb-12 rounded-3xl border border-blue-100 bg-blue-50/70 p-6 dark:border-blue-900/50 dark:bg-blue-950/30">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    <Flame className="size-5" />
                                </span>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-blue-950 dark:text-white">
                                        Ofertas especiales
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Aprovechá nuestros descuentos en
                                        productos seleccionados.
                                    </p>
                                </div>
                            </div>

                            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
                                {ofertas.map((producto) => (
                                    <article
                                        key={producto.id}
                                        className="group w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/10 dark:border-blue-900/50 dark:bg-slate-900"
                                    >
                                        <div className="relative aspect-square bg-blue-50 dark:bg-slate-800">
                                            {producto.imagen ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-blue-200 dark:text-blue-900">
                                                    <Package className="size-16" />
                                                </div>
                                            )}

                                            <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white shadow">
                                                -{descuentoDe(producto)}%
                                            </span>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="truncate font-semibold text-slate-800 dark:text-slate-100">
                                                {producto.nombre}
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-400 line-through">
                                                {formatPrice(producto.precio)}
                                            </p>

                                            <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">
                                                {formatPrice(
                                                    calcularPrecioFinal(
                                                        producto,
                                                    ),
                                                )}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addToCart(producto)
                                                }
                                                className={`mt-4 w-full py-2.5 ${btnPrimary}`}
                                            >
                                                <ShoppingCart className="size-4" />
                                                Agregar al carrito
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    <h2 className="mb-6 text-2xl font-bold text-blue-950 dark:text-white">
                        Productos
                    </h2>

                    {filtered.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-12 text-center text-slate-500 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-400">
                            <Search className="mx-auto mb-3 size-8 text-blue-300 dark:text-blue-800" />
                            No se encontraron productos.
                        </div>
                    ) : (
                        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((producto) => {
                                const sinStock = producto.stock <= 0;
                                const desc = descuentoDe(producto);

                                return (
                                    <article
                                        key={producto.id}
                                        className="flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/10 dark:border-blue-900/50 dark:bg-slate-900"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-blue-50 dark:bg-slate-800">
                                            {producto.imagen ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    loading="lazy"
                                                    className={`absolute inset-0 h-full w-full object-cover ${sinStock ? "opacity-50 grayscale" : ""}`}
                                                />
                                            ) : (
                                                <span className="absolute inset-0 flex items-center justify-center text-blue-200 dark:text-blue-900">
                                                    <Package className="size-14" />
                                                </span>
                                            )}

                                            {desc > 0 && !sinStock && (
                                                <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                                                    -{desc}%
                                                </span>
                                            )}

                                            {sinStock && (
                                                <span className="absolute left-3 top-3 rounded-full bg-slate-700 px-2.5 py-1 text-xs font-bold text-white shadow">
                                                    Sin stock
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            <h3 className="mb-1 text-base font-semibold text-slate-800 dark:text-slate-100">
                                                {producto.nombre}
                                            </h3>

                                            {!sinStock &&
                                                producto.stock <= 5 && (
                                                    <p className="text-xs font-medium text-sky-600 dark:text-sky-400">
                                                        ¡Últimas{" "}
                                                        {producto.stock}{" "}
                                                        unidades!
                                                    </p>
                                                )}

                                            <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                                                <div className="flex flex-col">
                                                    {desc > 0 && (
                                                        <span className="text-sm text-slate-400 line-through">
                                                            {formatPrice(
                                                                producto.precio,
                                                            )}
                                                        </span>
                                                    )}

                                                    <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                                        {formatPrice(
                                                            calcularPrecioFinal(
                                                                producto,
                                                            ),
                                                        )}
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

                <footer className="border-t border-blue-100 bg-white px-6 py-6 text-center text-xs text-slate-500 dark:border-blue-900/50 dark:bg-slate-950 dark:text-slate-400">
                    Tienda online · Todos los derechos reservados
                </footer>

                {/* Carrito lateral */}
                {cartOpen && (
                    <div className="fixed inset-0 z-40 flex justify-end">
                        <div
                            className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
                            onClick={() => setCartOpen(false)}
                        />

                        <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-950">
                            <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 text-white">
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <ShoppingCart className="size-5" />
                                    Tu carrito
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setCartOpen(false)}
                                    className="rounded-md p-1 transition hover:bg-white/15"
                                    aria-label="Cerrar carrito"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {cart.length === 0 ? (
                                    <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                                        <ShoppingCart className="mx-auto mb-3 size-10 text-blue-200 dark:text-blue-900" />
                                        Tu carrito está vacío.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-blue-50 dark:divide-slate-800">
                                        {cart.map(({ producto, cantidad }) => {
                                            const desc = descuentoDe(producto);

                                            return (
                                                <li
                                                    key={producto.id}
                                                    className="flex gap-3 py-4 first:pt-0"
                                                >
                                                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-blue-300 dark:bg-slate-800 dark:text-blue-900">
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
                                                            <Package className="size-6" />
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                                {
                                                                    producto.nombre
                                                                }
                                                            </p>
                                                            {desc > 0 && (
                                                                <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                                                    -{desc}%
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="text-sm">
                                                            {desc > 0 && (
                                                                <p className="text-xs text-slate-400 line-through">
                                                                    {formatPrice(
                                                                        producto.precio,
                                                                    )}
                                                                </p>
                                                            )}

                                                            <p className="font-semibold text-blue-700 dark:text-blue-300">
                                                                {formatPrice(
                                                                    calcularPrecioFinal(
                                                                        producto,
                                                                    ),
                                                                )}
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
                                                                className="flex size-7 items-center justify-center rounded-md border border-blue-200 text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                                                                aria-label="Quitar una unidad"
                                                            >
                                                                <Minus className="size-3.5" />
                                                            </button>
                                                            <span className="w-6 text-center text-sm font-medium tabular-nums">
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
                                                                className="flex size-7 items-center justify-center rounded-md border border-blue-200 text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                                                                aria-label="Agregar una unidad"
                                                            >
                                                                <Plus className="size-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeFromCart(
                                                                        producto.id,
                                                                    )
                                                                }
                                                                className="ml-auto flex items-center gap-1 text-xs text-slate-500 transition hover:text-red-600 dark:text-slate-400"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                                Quitar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="border-t border-blue-100 bg-blue-50/60 px-6 py-5 dark:border-blue-900/50 dark:bg-blue-950/30">
                                    <div className="mb-4 flex items-baseline justify-between text-lg font-bold text-blue-950 dark:text-white">
                                        <span>Total</span>
                                        <span className="tabular-nums">
                                            {formatPrice(cartTotal)}
                                        </span>
                                    </div>

                                    <Link
                                        href={auth.user ? checkout() : login()}
                                        className={`w-full py-3 ${btnPrimary}`}
                                    >
                                        {auth.user
                                            ? "Finalizar compra"
                                            : "Iniciá sesión para comprar"}
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