import { Head, Link } from "@inertiajs/react";
import ProveedorForm from "@/components/Proveedores/formProveedores";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck } from "lucide-react";

export default function Create() {
    return (
        <>
            <Head title="Nuevo proveedor" />

            <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
                <div className="mx-auto max-w-2xl">
                    {/* Encabezado */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                <Truck className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Nuevo proveedor
                                </h1>

                                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                    Completa los datos del nuevo proveedor.
                                </p>
                            </div>
                        </div>

                        <Button
                            asChild
                            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            <Link href="/proveedores">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    {/* Formulario */}
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <ProveedorForm />
                    </div>
                </div>
            </div>
        </>
    );
}
