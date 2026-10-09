import { useForm, Link } from "@inertiajs/react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    costo: number;
    stock: number;
    imagen: string | null;
    proveedor_id: number;
    proveedor: {
        id: number;
        nombre: string;
    };
}


interface Props {
    producto: Producto;
    proveedores: Record<number, string>;
}

export default function edit({ producto, proveedores }: Props) {
    const { data, setData, put , processing, errors } = useForm({
        nombre: producto.nombre,
        precio: producto.precio.toString(),
        costo: producto.costo.toString(),
        stock: producto.stock.toString(),
        imagen: null as File | null,
        proveedor_id: producto.proveedor_id.toString(),
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        put(`/productos/${producto.id}`, {
            forceFormData: true,
        });
    };

    return (
        <div className="p-6">
            <div className="mx-auto max-w-2xl ">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Editar producto</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Editar el producto.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Nombre</label>
                        <input
                            type="text"
                            value={data.nombre}
                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre del producto"
                            onChange={(e) => setData("nombre", e.target.value)}
                        />
                        {errors.nombre && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.nombre}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Precio</label>
                        <input
                            type="text"
                            value={data.precio}
                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Precio del producto"
                            onChange={(e) => setData("precio", e.target.value)}
                        />
                        {errors.precio && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.precio}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Costo</label>
                        <input
                            type="text"
                            value={data.costo}
                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Costo del producto"
                            onChange={(e) => setData("costo", e.target.value)}
                        />
                        {errors.costo && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.costo}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Stock</label>
                        <input
                            type="numeric"
                            step="0.1"
                            value={data.stock}
                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Stock del producto"
                            onChange={(e) => setData("stock", e.target.value)}
                        />
                        {errors.stock && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.stock}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Imagen</label>
                        // el campo de imagen es de tipo file
                        <input
                            type="file"
                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="URL de la imagen del producto"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setData("imagen", file);
                            }}
                        />
                        {errors.imagen && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.imagen}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Proveedor</label>

                        <select
                            value={data.proveedor_id}
                            onChange={(e) =>
                                setData("proveedor_id", e.target.value)
                            }
                            className="w-full appearance-none px-3 py-2 bg-transparent border border-gray-500 rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed "
                        >
                            <option
                                value=""
                                className="text-gray-800 bg-gray-200"
                            >
                                Seleccione un proveedor
                            </option>
                            {Object.entries(proveedores).map(([id, nombre]) => (
                                <option
                                    key={id}
                                    value={id}
                                    className="bg-gray-200 text-gray-800"
                                >
                                    {nombre}
                                </option>
                            ))}
                        </select>
                        {errors.proveedor_id && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.proveedor_id}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Actualizando..." : "Actualizar Producto"}
                        </Button>

                        <Button variant="outline" asChild>
                            <Link href="/productos">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
