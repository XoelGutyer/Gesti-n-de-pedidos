import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Sistema de Gestión" />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">

                {/* Header */}
                <header className="flex w-full items-center justify-between px-6 py-5 lg:px-12">
                    <div className="text-lg font-semibold">
                        Sistema de Gestión
                    </div>

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-md bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                            >
                                Ir al Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-md border border-[#1b1b1835] px-5 py-2 text-sm font-medium transition hover:bg-[#f5f5f2] dark:border-[#3E3E3A] dark:hover:bg-[#161615]"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Contenido principal */}
                <main className="flex flex-1 items-center justify-center px-6 py-12">
                    <div className="w-full max-w-5xl">

                        {/* Presentación */}
                        <section className="mb-12 text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1b1b18] text-2xl text-white shadow-lg dark:bg-[#eeeeec] dark:text-[#1C1C1A]">
                                SG
                            </div>

                            <h1 className="mb-4 text-4xl font-semibold tracking-tight lg:text-5xl">
                                Sistema de Gestión
                            </h1>

                            <p className="mx-auto max-w-2xl text-base leading-7 text-[#706f6c] dark:text-[#A1A09A] lg:text-lg">
                                Administra tus productos, pedidos y clientes
                                desde un solo lugar de forma sencilla y
                                organizada.
                            </p>

                            {!auth.user && (
                                <div className="mt-7">
                                    <Link
                                        href={login()}
                                        className="inline-flex rounded-md bg-[#1b1b18] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                    >
                                        Inicia Sesion para Comenzar
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Funcionalidades */}
                        <section className="grid gap-5 md:grid-cols-3">

                            {/* Productos */}
                            <div className="rounded-xl border border-[#e5e5e0] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f3f3ef] text-xl dark:bg-[#252523]">
                                    📦
                                </div>

                                <h2 className="mb-2 text-lg font-semibold">
                                    Productos
                                </h2>

                                <p className="text-sm leading-6 text-[#706f6c] dark:text-[#A1A09A]">
                                    Registra y administra tus productos,
                                    precios, costos y stock de manera
                                    organizada.
                                </p>
                            </div>

                            {/* Pedidos */}
                            <div className="rounded-xl border border-[#e5e5e0] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f3f3ef] text-xl dark:bg-[#252523]">
                                    🛒
                                </div>

                                <h2 className="mb-2 text-lg font-semibold">
                                    Pedidos
                                </h2>

                                <p className="text-sm leading-6 text-[#706f6c] dark:text-[#A1A09A]">
                                    Gestiona pedidos, consulta sus detalles,
                                    controla pagos y mantén un seguimiento
                                    de las ventas.
                                </p>
                            </div>

                            {/* Clientes */}
                            <div className="rounded-xl border border-[#e5e5e0] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f3f3ef] text-xl dark:bg-[#252523]">
                                    👥
                                </div>

                                <h2 className="mb-2 text-lg font-semibold">
                                    Clientes
                                </h2>

                                <p className="text-sm leading-6 text-[#706f6c] dark:text-[#A1A09A]">
                                    Administra la información de tus clientes
                                    y consulta fácilmente sus pedidos y
                                    operaciones.
                                </p>
                            </div>

                        </section>

                        {/* Características */}
                        <section className="mt-8 rounded-xl border border-[#e5e5e0] bg-white p-7 dark:border-[#3E3E3A] dark:bg-[#161615]">
                            <div className="grid gap-6 md:grid-cols-3">

                                <div>
                                    <p className="mb-1 text-sm font-medium">
                                        📊 Información organizada
                                    </p>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Toda la información del negocio en un
                                        solo sistema.
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-sm font-medium">
                                        🔐 Acceso seguro
                                    </p>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        El sistema requiere autenticación para
                                        acceder a sus funciones.
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-sm font-medium">
                                        ⚡ Gestión sencilla
                                    </p>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Diseñado para facilitar las tareas
                                        diarias del negocio.
                                    </p>
                                </div>

                            </div>
                        </section>

                    </div>
                </main>

                {/* Footer */}
                <footer className="px-6 py-6 text-center text-xs text-[#706f6c] dark:text-[#A1A09A]">
                    Sistema de Gestión · Productos · Pedidos · Clientes
                </footer>

            </div>
        </>
    );
}
