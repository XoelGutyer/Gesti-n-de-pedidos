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

    const inputClass = `
        w-full rounded-lg border border-blue-200
        bg-white px-3 py-2.5 text-sm text-slate-900
        outline-none transition-colors
        placeholder:text-slate-400
        focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        dark:border-blue-900/70 dark:bg-slate-950
        dark:text-white dark:placeholder:text-slate-500
        dark:focus:border-blue-500 dark:focus:ring-blue-950
    `;

    const labelClass =
        'mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200';

    return (
        <form onSubmit={submit} className="space-y-6">

            {/* Nombre */}
            <div>
                <label htmlFor="nombre" className={labelClass}>
                    Nombre
                </label>

                <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={inputClass}
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
                <label htmlFor="email" className={labelClass}>
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
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
                <label htmlFor="telefono" className={labelClass}>
                    Teléfono
                </label>

                <input
                    id="telefono"
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className={inputClass}
                    placeholder="387 123 4567"
                />

                {errors.telefono && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.telefono}
                    </p>
                )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 border-t border-blue-100 pt-5 dark:border-blue-900/50">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.visit('/proveedores')}
                    className="
                        border-blue-200 text-blue-700
                        hover:bg-blue-50 hover:text-blue-800
                        dark:border-blue-900 dark:text-blue-300
                        dark:hover:bg-blue-950
                    "
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    disabled={procesando}
                    className="
                        bg-blue-600 text-white
                        hover:bg-blue-700
                        disabled:cursor-not-allowed disabled:opacity-60
                        dark:bg-blue-600 dark:hover:bg-blue-700
                    "
                >
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
