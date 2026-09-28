import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Proveedor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
}

interface Props {
    proveedor?: Proveedor;
}

export default function ProveedorForm({ proveedor }: Props) {
    const editando = !!proveedor;

    const [nombre, setNombre] = useState(proveedor?.nombre ?? '');
    const [email, setEmail] = useState(proveedor?.email ?? '');
    const [telefono, setTelefono] = useState(proveedor?.telefono ?? '');

    const [errors, setErrors] = useState<{
        nombre?: string;
        email?: string;
        telefono?: string;
    }>({});

    const [procesando, setProcesando] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        setProcesando(true);
        setErrors({});

        const data = {
            nombre,
            email,
            telefono,
        };

        if (editando) {
            router.put(`/proveedores/${proveedor.id}`, data, {
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setProcesando(false);
                },
            });
        } else {
            //si No esta editando entonces esta creando y se redirge a /proveedores con el metdo post
            router.post('/proveedores', data, {
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setProcesando(false);
                },
            });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Nombre */}
            <div>
                <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-medium"
                >
                    Nombre
                </label>

                <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Nombre del proveedor"
                />

                {errors.nombre && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.nombre}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="proveedor@email.com"
                />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                    </p>
                )}
            </div>

            {/* Teléfono */}
            <div>
                <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-medium"
                >
                    Teléfono
                </label>

                <input
                    id="telefono"
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="387 123 4567"
                />

                {errors.telefono && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.telefono}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.visit('/proveedores')}
                >
                    Cancelar
                </Button>

                <Button type="submit" disabled={procesando}>
                    {procesando
                        ? 'Guardando...'
                        : editando
                          ? 'Actualizar proveedor'
                          : 'Crear proveedor'}
                </Button>
            </div>
        </form>
    );
}

