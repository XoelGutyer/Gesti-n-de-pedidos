
import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Package, Truck, RotateCcw, Trash2 } from 'lucide-react';

type Producto = {
    id: number;
    nombre: string;
    precio: number | string;
    stock: number;
};

type Proveedor = {
    id: number;
    nombre: string;
};

interface Cliente {
    id: number;
    nombre: string;
    direccion: string;
    email: string;
    dia:string;
    celular: string;
    //usuario: Usuario | null;
}

type Props = {
    productos: Producto[];
    proveedores: Proveedor[];
    clientes: Cliente[];
};

export default function Index({ productos, proveedores, clientes }: Props) {
    const [pestana, setPestana] = useState<'productos' | 'proveedores' | 'clientes'>(
        'productos'
    );

    const activarProducto = (id: number) => {
        if (!confirm('¿Querés reactivar este producto?')) return;

        router.patch(`/papelera/productos/${id}/activar`, {}, {
            preserveScroll: true,
        });
    };

    const activarProveedor = (id: number) => {
        if (!confirm('¿Querés reactivar este proveedor?')) return;

        router.patch(`/papelera/proveedores/${id}/activar`, {}, {
            preserveScroll: true,
        });
    };

    const restaurarCliente = (id:number) => {
        if (!confirm('¿Querés reactivar este cliente?')) return;
        router.put(`/papelera/clientes/${id}/restaurar`, {}, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Papelera" />

            <div className="p-6">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <Trash2 className="h-7 w-7" />
                            <h1 className="text-2xl font-bold">
                                Papelera
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Consultá los registros desactivados y recuperá
                            los que quieras volver a utilizar.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b">
                        <button
                            type="button"
                            onClick={() => setPestana('productos')}
                            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
                                pestana === 'productos'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Package className="h-4 w-4" />
                            Productos
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                {productos.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPestana('proveedores')}
                            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
                                pestana === 'proveedores'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Truck className="h-4 w-4" />
                            Proveedores
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                {proveedores.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPestana('clientes')}
                            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
                                pestana === 'clientes'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Truck className="h-4 w-4" />
                            clientes
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                {clientes.length}
                            </span>
                        </button>                        
                    </div>

                    {pestana === 'productos' && (
                        <div className="overflow-hidden rounded-xl border bg-card">
                            <div className="border-b p-4">
                                <h2 className="font-semibold">
                                    Productos desactivados
                                </h2>
                            </div>

                            {productos.length === 0 ? (
                                <div className="p-10 text-center">
                                    <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                    <p className="font-medium">
                                        No hay productos en la papelera
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Los productos desactivados aparecerán aquí.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Nombre
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Precio
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Stock
                                                </th>
                                                <th className="px-4 py-3 text-right font-medium">
                                                    Acción
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">
                                            {productos.map((producto) => (
                                                <tr key={producto.id}>
                                                    <td className="px-4 py-3 font-medium">
                                                        {producto.nombre}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {producto.precio}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {producto.stock}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                activarProducto(producto.id)
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 font-medium hover:bg-muted"
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                            Reactivar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {pestana === 'proveedores' && (
                        <div className="overflow-hidden rounded-xl border bg-card">
                            <div className="border-b p-4">
                                <h2 className="font-semibold">
                                    Proveedores desactivados
                                </h2>
                            </div>

                            {proveedores.length === 0 ? (
                                <div className="p-10 text-center">
                                    <Truck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                    <p className="font-medium">
                                        No hay proveedores en la papelera
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Los proveedores desactivados aparecerán aquí.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Nombre
                                                </th>
                                                <th className="px-4 py-3 text-right font-medium">
                                                    Acción
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">
                                            {proveedores.map((proveedor) => (
                                                <tr key={proveedor.id}>
                                                    <td className="px-4 py-3 font-medium">
                                                        {proveedor.nombre}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                activarProveedor(proveedor.id)
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 font-medium hover:bg-muted"
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                            Reactivar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {pestana === 'clientes' && (
                        <div className="overflow-hidden rounded-xl border bg-card">
                            <div className="border-b p-4">
                                <h2 className="font-semibold">
                                    clientes desactivados
                                </h2>
                            </div>

                            {clientes.length === 0 ? (
                                <div className="p-10 text-center">
                                    <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                    <p className="font-medium">
                                        No hay clientes en la papelera
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Los clientes desactivados aparecerán aquí.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Nombre
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Direccion
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Email
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Dia
                                                </th>                                                
                                                <th className="px-4 py-3 text-left font-medium">
                                                    Celular
                                                </th>                                                
                                                <th className="px-4 py-3 text-right font-medium">
                                                    Acción
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">
                                            {clientes.map((cliente) => (
                                                <tr key={cliente.id}>
                                                    <td className="px-4 py-3 font-medium">
                                                        {cliente.nombre}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {cliente.direccion}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {cliente.email}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {cliente.dia}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {cliente.celular}
                                                    </td>                                                    
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                restaurarCliente(cliente.id)
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 font-medium hover:bg-muted"
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                            Reactivar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
