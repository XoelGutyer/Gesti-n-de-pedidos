
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

            <div className="min-h-screen bg-muted/30 px-4 py-8 md:px-8 lg:px-12">
                <div className="mx-auto w-full max-w-6xl">

                    {/* Encabezado */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Truck className="h-4 w-4" />
                                Proveedores
                                <span>/</span>
                                Editar
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                Editar proveedor
                            </h1>

                            <p className="mt-2 text-base text-muted-foreground">
                                Modificá la información del proveedor
                                y guardá los cambios.
                            </p>
                        </div>

                        <Button variant="outline" asChild>
                            <Link href="/proveedores">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    {/* Formulario */}
                    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                        <div className="border-b px-6 py-5 md:px-8">
                            <h2 className="text-xl font-semibold">
                                Datos del proveedor
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                ID del proveedor: {proveedor.id}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-2 md:gap-8 md:px-8">

                                {/* Nombre */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="nombre">
                                        Nombre del proveedor
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData('nombre', e.target.value)
                                        }
                                        placeholder="Ingresá el nombre del proveedor"
                                        className="h-12 text-base"
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
                                    <Label htmlFor="email">
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
                                        className="h-12 text-base"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-2">
                                    <Label htmlFor="telefono">
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
                                        className="h-12 text-base"
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-red-500">
                                            {errors.telefono}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    asChild
                                >
                                    <Link href="/proveedores">
                                        Cancelar
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={processing}
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
