import { useForm, Link, Head } from "@inertiajs/react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Package } from "lucide-react";

interface Props {
    proveedores: Record<number, string>;
}

export default function Create({ proveedores }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        precio: "",
        costo: "",
        stock: "",
        descuento: "0",
        imagen: null as File | null,
        proveedor_id: "",
    });

    const proveedorOptions = Object.entries(proveedores)
        .map(([id, nombre]) => ({ value: id, label: nombre }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post("/productos", {
            forceFormData: true,
        });
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
        "text-sm font-semibold text-slate-700 dark:text-slate-200";

    return (
        <>
            <Head title="Nuevo producto" />

            <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
                <div className="mx-auto max-w-2xl">

                    {/* Encabezado */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <Package className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Nuevo producto
                            </h1>

                            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                Completa los datos del nuevo producto.
                            </p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                        <form onSubmit={submit} className="flex flex-col gap-5">

                            {/* Nombre */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="nombre" className={labelClass}>
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    className={inputClass}
                                    placeholder="Nombre del producto"
                                    onChange={(e) =>
                                        setData("nombre", e.target.value)
                                    }
                                />

                                {errors.nombre && (
                                    <p className="text-sm text-red-500">
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            {/* Precio */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="precio" className={labelClass}>
                                    Precio
                                </label>

                                <input
                                    id="precio"
                                    type="text"
                                    value={data.precio}
                                    className={inputClass}
                                    placeholder="Precio del producto"
                                    onChange={(e) =>
                                        setData("precio", e.target.value)
                                    }
                                />

                                {errors.precio && (
                                    <p className="text-sm text-red-500">
                                        {errors.precio}
                                    </p>
                                )}
                            </div>

                            {/* Descuento */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="descuento" className={labelClass}>
                                    Descuento (%)
                                </label>

                                <input
                                    id="descuento"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.descuento}
                                    className={inputClass}
                                    placeholder="Ej. 10"
                                    onChange={(e) =>
                                        setData("descuento", e.target.value)
                                    }
                                />

                                {errors.descuento && (
                                    <p className="text-sm text-red-500">
                                        {errors.descuento}
                                    </p>
                                )}
                            </div>

                            {/* Costo */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="costo" className={labelClass}>
                                    Costo
                                </label>

                                <input
                                    id="costo"
                                    type="text"
                                    value={data.costo}
                                    className={inputClass}
                                    placeholder="Costo del producto"
                                    onChange={(e) =>
                                        setData("costo", e.target.value)
                                    }
                                />

                                {errors.costo && (
                                    <p className="text-sm text-red-500">
                                        {errors.costo}
                                    </p>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="stock" className={labelClass}>
                                    Stock
                                </label>

                                <input
                                    id="stock"
                                    type="number"
                                    step="0.1"
                                    value={data.stock}
                                    className={inputClass}
                                    placeholder="Stock del producto"
                                    onChange={(e) =>
                                        setData("stock", e.target.value)
                                    }
                                />

                                {errors.stock && (
                                    <p className="text-sm text-red-500">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>

                            {/* Imagen */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="imagen" className={labelClass}>
                                    Imagen
                                </label>

                                <input
                                    id="imagen"
                                    accept="image/*"
                                    type="file"
                                    className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300`}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        setData("imagen", file);
                                    }}
                                />

                                {errors.imagen && (
                                    <p className="text-sm text-red-500">
                                        {errors.imagen}
                                    </p>
                                )}
                            </div>

                            {/* Proveedor */}
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>
                                    Proveedor
                                </label>

                                <Combobox
                                    options={proveedorOptions}
                                    value={data.proveedor_id}
                                    onChange={(v) =>
                                        setData("proveedor_id", v)
                                    }
                                    placeholder="Seleccione un proveedor"
                                    searchPlaceholder="Buscar proveedor..."
                                    emptyText="No se encontraron proveedores."
                                />

                                {errors.proveedor_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.proveedor_id}
                                    </p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 border-t border-blue-100 pt-5 dark:border-blue-900/50">
                                <Button
                                    variant="outline"
                                    asChild
                                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
                                >
                                    <Link href="/productos">
                                        Cancelar
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    {processing
                                        ? "Guardando..."
                                        : "Guardar producto"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
