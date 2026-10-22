import { Head, Link } from "@inertiajs/react";
import ProveedorForm from "@/components/Proveedores/formProveedores";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Create() {
    return (
        <>
            <Head title="Nuevo proveedor" />

            <div className="p-6">
                <div className="mx-auto max-w-2xl ">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Nuevo proveedor
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Completa los datos del nuevo proveedor.
                            </p>
                        </div>

                        <Button variant="outline" asChild>
                            <Link href="/proveedores">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <ProveedorForm />
                    </div>
                </div>
            </div>
        </>
    );
}
