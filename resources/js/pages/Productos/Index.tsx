import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import { Plus } from "lucide-react";

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    costo: number;
    stock: number;
    imagen: string;
    proveedor: {
        nombre: string;
    };
}

export default function Index({ productos }: { productos: Producto[] }) {
    return (
        <div>
            <div className="w-full max-w-7xl mx-auto mt-10 p-6 space-y-6">
                <Head>
                    <title>Listado de productos</title>
                </Head>
                <div className="flex justify-between items-center">
                    <div className="overflow-x-auto">
                        <h1 className="text-2xl font-bold text-white">Productos</h1>
                        <h4 className="text-sm text-white">Lista de productos registrados en el sistema.</h4>
                    </div>
                    <Button asChild>
                        <Link href="/productos/create">
                            <Plus />
                            Nuevo producto
                        </Link>
                    </Button>
                </div>

                <div className="w-full rounded-xl shadow-sm bg-card border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-white">Imagen</th>
                                    <th className="px-6 py-4 font-semibold text-white">Nombre</th>
                                    <th className="px-6 py-4 font-semibold text-white">Precio</th>
                                    {/*<th className="px-6 py-4 font-semibold text-white">Costo</th>*/}
                                    <th className="px-6 py-4 font-semibold text-white">Stock</th>
                                    {/*<th className="px-6 py-4 font-semibold text-white">Imagen</th>*/}
                                    <th className="px-6 py-4 font-semibold text-white">Proveedor</th>
                                    <th className="px-6 py-4 font-semibold text-white">Acciones</th>                                
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {productos.length > 0 ? (
                                    productos.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {producto.imagen ? (
                                                    <img src={`/storage/${producto.imagen}`} alt={producto.nombre} className="w-16 h-16 object-cover rounded-md" />
                                                ) : (
                                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{producto.nombre}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{producto.precio}</td>
                                            {/*<td className="px-6 py-4 font-medium text-gray-900">{producto.costo}</td>*/}
                                            <td className="px-6 py-4 font-medium text-gray-900">{producto.stock}</td>
                                            {/*<td className="px-6 py-4 font-medium text-gray-900">{producto.imagen}</td>*/}
                                            <td className="px-6 py-4 font-medium text-gray-900">{producto.proveedor.nombre}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                                                    <Button variant="default" className="bg-gray-600 hover:bg-blue-700" asChild>
                                                        <Link href={`/productos/${producto.id}/edit`}>
                                                            Editar
                                                        </Link>
                                                    </Button>

                                                    <Button variant="destructive" asChild>
                                                        <Link href={`/productos/${producto.id}/delete`}>
                                                            Eliminar
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            No hay productos disponibles.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>    
                </div>
                
            </div>
        </div>
    )
}
