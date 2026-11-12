import { Button } from "@/components/ui/button";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Check, Eye, FileText, Pencil, Plus } from "lucide-react";

interface DetallePedido {
    id: number;
    cantidad: number;
    precioProducto: number;
    costoProducto: number;
    subtotal: number;
    producto_id: number;
    producto: {
        nombre: string;
    };
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
    const [seleccion, setSeleccion] = useState<number[]>([]);
    const todos = pedidos.length > 0 && seleccion.length === pedidos.length;

    const alternar = (id: number) =>
        setSeleccion((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
        );

    const alternarTodos = () =>
        setSeleccion(todos ? [] : pedidos.map((p) => p.id));

    const abrirRemitos = (ids: number[]) => {
        const q = new URLSearchParams();
        ids.forEach((id) => q.append("ids[]", String(id)));
        window.open(`/pedidos/remitos?${q.toString()}`, "_blank");
    };

    const marcarPagado = (p: Pedido) => {
        if (!confirm(`¿Marcar el pedido #${p.id} como pagado?`)) return;
        router.patch(
            `/pedidos/${p.id}/marcar-pagado`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="p-6">
            <Head title="Pedidos" />
            <div className="mb-6 flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-white">Pedidos</h1>

                <div className="flex items-center gap-2">
                    {seleccion.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => abrirRemitos(seleccion)}
                        >
                            <FileText />
                            Crear remitos ({seleccion.length})
                        </Button>
                    )}
                    <Button asChild>
                        <Link href="/pedidos/create">
                            <Plus />
                            Nuevo pedido
                        </Link>
                    </Button>
                </div>
            </div>

            {flash?.success && (
                <div
                    className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                    role="alert"
                >
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <tr>
                                <th className="w-10 px-4 py-4">
                                    <input
                                        type="checkbox"
                                        className="size-4"
                                        checked={todos}
                                        onChange={alternarTodos}
                                        aria-label="Seleccionar todos"
                                    />
                                </th>
                                {[
                                    "ID",
                                    "Cliente",
                                    "Fecha",
                                    "Pagado",
                                    "Total",
                                    "Acciones",
                                ].map((t) => (
                                    <th
                                        key={t}
                                        className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200"
                                    >
                                        {t}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.length > 0 ? (
                                pedidos.map((pedido) => (
                                    <tr
                                        key={pedido.id}
                                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                className="size-4"
                                                checked={seleccion.includes(
                                                    pedido.id,
                                                )}
                                                onChange={() =>
                                                    alternar(pedido.id)
                                                }
                                                aria-label={`Seleccionar pedido ${pedido.id}`}
                                            />
                                        </td>
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
                                            {pedido.pagado ? "Sí" : "No"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            ${Number(pedido.total).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/pedidos/${pedido.id}`}
                                                    >
                                                        <Eye /> Ver detalle
                                                    </Link>
                                                </Button>
                                                {!pedido.pagado && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/pedidos/${pedido.id}/editar-items`}
                                                            >
                                                                <Pencil />{" "}
                                                                Editar ítems
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                marcarPagado(
                                                                    pedido,
                                                                )
                                                            }
                                                        >
                                                            <Check /> Marcar
                                                            pagado
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
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
    );
}
