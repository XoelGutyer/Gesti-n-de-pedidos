
import { Head } from '@inertiajs/react';
import ProveedorForm from '@/components/Proveedores/formProveedores';

export default function Create() {
    return (
        <>
            <Head title="Nuevo proveedor" />

            <div className="p-6">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">
                            Nuevo proveedor
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Completa los datos del nuevo proveedor.
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <ProveedorForm />
                    </div>
                </div>
            </div>
        </>
    );
}

