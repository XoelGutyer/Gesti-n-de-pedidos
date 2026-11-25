import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

interface DiaOpcion {
    value: string;
    label: string;
}

interface Props {
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

export default function Create({ opcionesDeDias }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        direccion: "",
        email: "",
        dia: "",
        celular: "",
        crear_usuario: false,
        name: "",
        contraseña: "",
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post("/clientes");
    };

    return (
        <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
            <Head title="Nuevo cliente" />

            <div className="mx-auto max-w-2xl">
                {/* Encabezado */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <UserPlus className="size-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Nuevo cliente
                            </h1>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Registrá los datos del cliente
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

                        {/* Cuenta de usuario */}
                        <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                            <div className="flex items-center gap-2">
                                <input
                                    id="crear_usuario"
                                    type="checkbox"
                                    checked={data.crear_usuario}
                                    onChange={(e) =>
                                        setData(
                                            "crear_usuario",
                                            e.target.checked,
                                        )
                                    }
                                    className="size-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="crear_usuario"
                                    className="text-sm font-medium text-slate-800 dark:text-slate-200"
                                >
                                    ¿Tiene una cuenta?
                                </label>
                            </div>

                            {data.crear_usuario ? (
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    Se usará el correo del formulario para
                                    vincular su cuenta.
                                </p>
                            ) : (
                                <div className="mt-4 flex flex-col gap-4">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Podés crear un usuario y una contraseña
                                        para este cliente.
                                    </p>

                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="name"
                                            className={labelClass}
                                        >
                                            Nombre de usuario
                                        </label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={inputClass}
                                            placeholder="Nombre de usuario"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="contraseña"
                                            className={labelClass}
                                        >
                                            Contraseña
                                        </label>
                                        <Input
                                            id="contraseña"
                                            type="password"
                                            value={data.contraseña}
                                            onChange={(e) =>
                                                setData(
                                                    "contraseña",
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Ingresar contraseña"
                                        />
                                        <InputError
                                            message={errors.contraseña}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            )}
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
                                    ? "Guardando..."
                                    : "Guardar cliente"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
