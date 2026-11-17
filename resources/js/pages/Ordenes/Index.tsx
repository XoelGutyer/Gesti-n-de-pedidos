import { Button } from "@/components/ui/button";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Check, Eye, FileText, Pencil, Plus } from "lucide-react";

interface Filtro{
    ordenes: string;
    orden: string;
    direccion: string;
}

interface DetalleOrden {
    id: number;
    cantidad: number;
    costoProducto: number;
    producto_id: number;
    producto: {
        nombre: string;
    };
}

interface Orden {
    id: number;
    total: number;
    estado: string;
    proveedor: {
        nombre: string;
    };
    usuario: {
        name: string;
    };
    items: DetalleOrden[];
}

interface Props {
    ordenes: Orden[];
    filtros: Filtro
    flash?: {
        success?: string;
    };
}

export default function Index({ ordenes, filtros, flash }: Props) {
    const [orden, setOrden] = useState(filtros.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(
        filtros.direccion ?? 'asc'
    );

    const ordenarPor = (campo : string) =>{
        let nuevaDireccion = 'asc';
        if(orden === campo && direccion === 'asc'){
            nuevaDireccion = 'desc';
        }
        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get('/ordenes',{
            orden: campo,
            direccion: nuevaDireccion,
        })
    }   
    const indicadorOrden = (campo : string ) =>{
        if(orden !== campo){
            return '';
        }
        return direccion === 'asc' ? ' ↑' : ' ↓';
    }

    return (
        <div className="p-6">
            <Head title="Ordenes" />
            <div className="mb-6 flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-white">Ordenes de compra</h1>

                <div className="flex items-center gap-2">
                    {/* {seleccion.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => abrirRemitos(seleccion)}
                        >
                            <FileText />
                            Crear remitos ({seleccion.length})
                        </Button>
                    )} */}
                    <Button asChild>
                        <Link href="/ordenes/create">
                            <Plus />
                            Nueva orden
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
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => ordenarPor('nombre')}>Proveedor{indicadorOrden('nombre')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => ordenarPor('estado')}>Estado{indicadorOrden('estado')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => ordenarPor('total')}>Total{indicadorOrden('total')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ordenes.length > 0 ? (
                                ordenes.map((orden) => (
                                    <tr
                                        key={orden.id}
                                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                    >
                                        {/* <td className="px-4 py-4">
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
                                        </td> */}
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {orden.id}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {orden.proveedor.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {orden.estado}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            ${Number(orden.total).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/ordenes/${orden.id}`}
                                                    >
                                                        <Eye /> Ver detalle
                                                    </Link>
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/ordenes/${orden.id}/editar-items`}
                                                    >
                                                        <Pencil />{" "}
                                                        Editar ítems
                                                    </Link>
                                                </Button>
                                                {/* <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                marcarPagado(
                                                                    pedido,
                                                                )
                                                            }
                                                        >
                                                            <Check /> Marcar
                                                            pagado
                                                        </Button> */}


                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
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
