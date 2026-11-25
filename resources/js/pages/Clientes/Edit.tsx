import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { ArrowLeft, UserRoundPen } from "lucide-react";

interface Usuario {
    id: number;
    name: string;
}

interface Cliente {
    id: number;
    nombre: string;
    direccion: string;
    email: string;
    dia: string;
    celular: string;
    usuario: Usuario | null;
}

interface DiaOpcion {
    value: string;
    label: string;
}

interface Props {
    cliente: Cliente;
    opcionesDeDias: DiaOpcion[];
}

const inputClass = `
    w-full border-blue-200 bg-white text-slate-900
    placeholder:text-slate-400
    focus-visible:border-blue-500 focus-visible:ring-blue-500
    dark:border-blue-900/70 dark:bg-slate-950 dark:text-slate-100
    dark:placeholder:text-slate-500
`;

const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-300";

export default function Edit({ cliente, opcionesDeDias }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: cliente.nombre,
        direccion: cliente.direccion,
        email: cliente.email,
        dia: cliente.dia,
        celular: cliente.celular,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/clientes/${cliente.id}`);
    };

    return (
        <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
            <Head title="Editar cliente" />

            <div className="mx-auto max-w-2xl">
                {/* Encabezado */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <UserRoundPen className="size-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Editar cliente
                            </h1>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Modificá los datos de {cliente.nombre}
                            </p>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        <Link href="/clientes">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </div>

                {/* Formulario */}
                <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        {/* Nombre */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="nombre" className={labelClass}>
                                Nombre
                            </label>
                            <Input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                className={inputClass}
                                placeholder="Nombre del cliente"
                            />
                            <InputError
                                message={errors.nombre}
                                className="mt-1"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className={labelClass}>
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className={inputClass}
                                placeholder="Email del cliente"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>

                        {/* Día de la semana */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="dia" className={labelClass}>
                                Día de la semana
                            </label>
                            <select
                                id="dia"
                                value={data.dia}
                                onChange={(e) => setData("dia", e.target.value)}
                                className={`${inputClass} rounded-md px-3 py-2`}
                            >
                                <option value="">Seleccione un día</option>
                                {opcionesDeDias.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.dia} className="mt-1" />
                        </div>

                        {/* Celular */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="celular" className={labelClass}>
                                Celular
                            </label>
                            <Input
                                id="celular"
                                type="text"
                                value={data.celular}
                                onChange={(e) =>
                                    setData("celular", e.target.value)
                                }
                                className={inputClass}
                                placeholder="Número de celular del cliente"
                            />
                            <InputError
                                message={errors.celular}
                                className="mt-1"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="direccion" className={labelClass}>
                                Domicilio
                            </label>
                            <Input
                                id="direccion"
                                type="text"
                                value={data.direccion}
                                onChange={(e) =>
                                    setData("direccion", e.target.value)
                                }
                                className={inputClass}
                                placeholder="Domicilio del cliente"
                            />
                            <InputError
                                message={errors.direccion}
                                className="mt-1"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 border-t border-blue-100 pt-5 dark:border-blue-900/50">
                            <Button
                                asChild
                                type="button"
                                variant="outline"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
                            >
                                <Link href="/clientes">Cancelar</Link>
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {processing
                                    ? "Actualizando..."
                                    : "Guardar cambios"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
