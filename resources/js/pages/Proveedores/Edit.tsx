import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type FormEvent } from 'react';
import { ArrowLeft, Save, Truck } from 'lucide-react';

interface Proveedor {
    id: number;
    nombre: string;
    email: string | null;
    telefono: string | null;
}

interface Props {
    proveedor: Proveedor;
}

export default function Edit({ proveedor }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: proveedor.nombre ?? '',
        email: proveedor.email ?? '',
        telefono: proveedor.telefono ?? '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/proveedores/${proveedor.id}`);
    };

    return (
        <>
            <Head title="Editar proveedor" />

            <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 md:px-8 lg:px-12">
                <div className="mx-auto w-full max-w-6xl">

                    {/* Encabezado */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                <Truck className="h-4 w-4" />
                                Proveedores
                                <span className="text-slate-400">/</span>
                                Editar
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                                Editar proveedor
                            </h1>

                            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                                Modificá la información del proveedor
                                y guardá los cambios.
                            </p>
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
                    <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">

                        {/* Cabecera de la tarjeta */}
                        <div className="border-b border-blue-100 px-6 py-5 dark:border-blue-900/50 md:px-8">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Datos del proveedor
                            </h2>

                            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                ID del proveedor: {proveedor.id}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-2 md:gap-8 md:px-8">

                                {/* Nombre */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="nombre" className="text-slate-700 dark:text-slate-200">
                                        Nombre del proveedor
                                    </Label>

                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData('nombre', e.target.value)
                                        }
                                        placeholder="Ingresá el nombre del proveedor"
                                        className="h-12 border-blue-200 bg-white text-base focus-visible:ring-blue-500 dark:border-blue-900/70 dark:bg-slate-950"
                                        required
                                    />

                                    {errors.nombre && (
                                        <p className="text-sm text-red-500">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                                        Correo electrónico
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="proveedor@ejemplo.com"
                                        className="h-12 border-blue-200 bg-white text-base focus-visible:ring-blue-500 dark:border-blue-900/70 dark:bg-slate-950"
                                    />

                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-2">
                                    <Label htmlFor="telefono" className="text-slate-700 dark:text-slate-200">
                                        Teléfono
                                    </Label>

                                    <Input
                                        id="telefono"
                                        type="tel"
                                        value={data.telefono}
                                        onChange={(e) =>
                                            setData('telefono', e.target.value)
                                        }
                                        placeholder="Ingresá el teléfono"
                                        className="h-12 border-blue-200 bg-white text-base focus-visible:ring-blue-500 dark:border-blue-900/70 dark:bg-slate-950"
                                    />

                                    {errors.telefono && (
                                        <p className="text-sm text-red-500">
                                            {errors.telefono}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col-reverse gap-3 border-t border-blue-100 bg-blue-50/50 px-6 py-5 dark:border-blue-900/50 dark:bg-slate-950/50 sm:flex-row sm:justify-end md:px-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    asChild
                                    className="border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
                                >
                                    <Link href="/proveedores">
                                        Cancelar
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={processing}
                                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Guardando...'
                                        : 'Guardar cambios'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
