import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import clientes from '@/routes/clientes';
interface DetallePedido {
    id: number;
    cantidad: number;
    precioProducto: number;
    costoProducto: number;
    subtotal: number;
    producto_id: number;
    producto: {
        nombre: string;
    }
}

interface Pedido {
    id: number;
    formato_fecha: string;
    nota: string;
    total: number;
    pagado: boolean;
    cliente: {
        nombre: string;
    };
    usuario: {
        name: string;
    };
    items: DetallePedido[];
}

interface Props {
    pedidos: Pedido[];
    flash?: {
        success?: string;
    };
}

export default function Index({ pedidos, flash }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6 overflow-x-auto flex justify-between items-center">
                <Head title="Pedidos" />
                <h1 className="text-2xl font-bold text-white">
                    Pedidos
                </h1>


                <Button asChild>
                    <Link href="/pedidos/create">
                        <Plus />
                        Nuevo producto
                    </Link>
                </Button>
            </div>

            {flash?.success && (
                <div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <span className="block sm:inline">
                        {flash.success}
                    </span>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                    ID
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                    Cliente
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                    Fecha
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                    Pagado
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                    Total
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                    Productos comprados
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.length > 0 ? (
                                pedidos.map((pedido) => (
                                    <tr key={pedido.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {pedido.id}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {pedido.cliente.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {pedido.formato_fecha}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {pedido.pagado}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {pedido.total}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            <ul className="list-disc list-inside space-y-1">
                                                {pedido.items.map((item) => (
                                                    <li key={item.id} className="text-xs flex flex-col">
                                                        <span className="font-medium">{item.producto.nombre}</span>
                                                        {' '} (x{item.cantidad}) - ${Number(item.precioProducto).toFixed(2)} c/u
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No hay pedidos registrados.
                                    </td>

                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    )
}