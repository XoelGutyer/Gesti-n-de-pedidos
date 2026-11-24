import { editarItems } from '@/actions/App/Http/Controllers/PedidoAccionesController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CircleCheck, Clock, Newspaper } from 'lucide-react';

interface Item {
    id: number;
    cantidad: number;
    costoProducto: string;
    producto_id: number;
    producto: {
        id: number;
        nombre: string;
        stock: number;
    };
}

interface Orden {
    id: number;
    total: string;
    estado: 'solicitado' | 'recibido' | 'cancelado';
    created_at: string;
    proveedor: {
        nombre: string;
        id: string;
        email: string | null;
        telefono: string | null;
    };
    usuario: {
        name: string;
    };
    items: Item[];
}

const statusConfig: Record<string, { label: string; classes: string }> = {
    solicitado: { label: 'Solicitado', classes: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    recibido: { label: 'Recibido (Stock ingresado)', classes: 'bg-green-100 text-green-800 border-green-300' },
    cancelado: { label: 'Cancelado', classes: 'bg-red-100 text-red-800 border-red-300' },
};

export default function Show({ orden }: { orden: Orden }) {
    const isFinalState = orden.estado === 'recibido' || orden.estado === 'cancelado';
    const badge = statusConfig[orden.estado];

    const { data, setData, patch, processing, errors } = useForm({
        estado: orden.estado,
        items: orden.items.map((item) => ({
            id: item.id,
            producto_id: item.producto_id,
            cantidad: Number(item.cantidad),
            costo: Number(item.costoProducto),
        })),
    });

// Actualiza cantidad o costo de una fila específica
    const handleItemChange = (index: number, field: 'cantidad' | 'costo', value: string) => {
        const updatedItems = [...data.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value === '' ? 0 : Number(value),
        };
        setData('items', updatedItems);
    };
    const liveTotal = data.items.reduce(
        (sum, item) => sum + Number(item.cantidad) * Number(item.costo),
        0
    );

    const unidades = orden.items.reduce((s, i) => s + i.cantidad, 0);

    const handleStatusUpdate = (newStatus: 'solicitado' | 'recibido' | 'cancelado') => {
        if (newStatus === 'recibido' && !confirm('¿Confirmas la recepción física? Esto sumará las cantidades al inventario.')) {
            return;
        }
        if (newStatus === 'cancelado' && !confirm('¿Seguro que deseas cancelar esta orden de compra?')) {
            return;
        }
        data.estado = newStatus;
        patch(`/ordenes/${orden.id}/estado`, {
        preserveScroll: true, 
        });
    };

    return (
            <div className="mx-auto flex max-w-4xl flex-col gap-4 p-6">

                <Button variant="ghost" size="sm" className="w-fit" asChild>
                    <Link href="/ordenes">
                        <ArrowLeft /> Volver a ordenes
                    </Link>
                </Button>

                {/* Cabecera con datos del proveedor y acciones de estado */}
                <div className="shadow rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 border-b pb-5">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Orden de Compra #{orden.id}</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Registrada el {new Date(orden.created_at).toLocaleString()} por{' '}
                                <span className="font-medium text-gray-500">{orden.usuario.name}</span>
                            </p>
                            <Badge variant={orden.estado == 'solicitado' ? 'default' : orden.estado == 'recibido' ? 'secondary': 'destructive'} className="gap-1">
                                {orden.estado == 'solicitado' ? <Clock className="size-3" /> : <CircleCheck className="size-3" />}
                                {orden.estado == 'solicitado' ? 'Solicitado' : orden.estado == 'recibido' ? 'recibido' : 'cancelado' }
                            </Badge>
                            
                        </div>

                        {/* Botones de flujo de estado (solo visibles si no está recibida ni cancelada) */}
                        {!isFinalState && (
                            <div className="flex flex-wrap gap-2">

                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate('recibido')}
                                    className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-md hover:bg-gray-300 transition cursor-pointer"
                                >
                                    ✓ Confirmar Recepción y Sumar Stock
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate('cancelado')}
                                    className="px-3 py-2 bg-black border text-white text-xs font-semibold rounded-md hover:bg-gray-600 transition cursor-pointer"
                                >
                                    Cancelar Orden
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Ficha del Proveedor */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-sm">
                        <div>
                            <span className="pb-1 block text-xs text-white uppercase font-semibold">Proveedor</span>
                            <span className="font-bold text-gray-400">{orden.proveedor.nombre}</span>
                        </div>
                        <div>
                            <span className="pb-1 block text-xs text-white uppercase font-semibold">Identificación Fiscal</span>
                            <span className="text-gray-400">{orden.proveedor.id}</span>
                        </div>
                        <div>
                            <span className="pb-1 block text-xs text-white uppercase font-semibold">Contacto</span>
                            <span className="text-gray-400">
                                {orden.proveedor.telefono || orden.proveedor.telefono || 'Sin datos de contacto'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabla de Ítems de la Orden */}
                <div className="shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-base font-bold text-gray-100 uppercase">Detalle de Productos</h2>
                        <span className='text-sm font-bold'>{orden.items.length} producto(s),  {unidades} unidad(es)</span>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Producto</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Cantidad Pedida</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Cantidad Recibida</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Costo Unitario</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Nuevo costo</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">SubTotal</th>
                            </tr>
                        </thead>
                        <tbody className="border-white divide-y divide-gray-200">
                            {orden.items.map((item,index) => {
                                const itemEditable = data.items[index];
                                const subtotal = itemEditable.cantidad * Number(itemEditable.costo);
                                return (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-white">
                                            {item.producto.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold text-white">
                                            {item.cantidad}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold text-white">
                                            {/* Cantidad */}
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={itemEditable.cantidad}
                                                    onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                                                    className="text-center w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                    {errors[`items.${index}.cantidad`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`items.${index}.cantidad`]}</p>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-white">
                                            ${Number(item.costoProducto).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-white">
                                            
                                            {/* Costo unitario */}
                                            <div className="">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={itemEditable.costo}
                                                    onChange={(e) => handleItemChange(index, 'costo', e.target.value)}
                                                    className="text-center w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors[`items.${index}.costo`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`items.${index}.costo`]}</p>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-white">
                                            ${subtotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="">
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-right text-sm font-bold text-gray-300 uppercase">
                                    Total de la Orden:
                                </td>
                                <td className="px-6 py-4 text-right text-xl font-extrabold text-indigo-200">
                                    ${liveTotal.toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
    );
}