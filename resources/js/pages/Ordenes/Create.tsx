import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FormEventHandler } from 'react';

// Definimos las interfaces para TypeScript
interface Producto {
    id: number;
    nombre: string;
    costo: number; // Costo de adquisición
    stock: number;
    proveedor_id: number; // ID del proveedor al que pertenece el producto
}

interface Proveedor {
    id: number;
    nombre: string;
}

interface DetalleOrden {
    producto_id: string | number;
    producto_nombre?: string;
    cantidad: number;
    costoProducto: number;
}

interface Props {
    proveedores: Proveedor[];
    productos: Producto[];
}

export default function Create({ proveedores, productos }: Props) {

    const producosDisponibles = (indexActual: number) => {
        const selectedProductIds = data.items
            .map((item, index) => (index !== indexActual ? item.producto_id : null)) // Cr}eamos un array de objetos con producto_id y su índice
            .filter(Boolean) // Filtramos los valores nulos
        return productosFiltrados.filter(producto => !selectedProductIds.includes(producto.id));
    };

    // 1. Configuramos el hook useForm de Inertia
    const { data, setData, post, processing, errors } = useForm({
        proveedor_id: '',
        items: [{ producto_id: '', producto_nombre: '', cantidad: 1, costoProducto: 0 }] as DetalleOrden[],
    });

    const handleproveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newproveedorId = e.target.value;
        setData({
            ...data,
            proveedor_id: newproveedorId,
            items: [{ producto_id: '', producto_nombre: '', cantidad: 1, costoProducto: 0 }] // Reiniciamos los productos al cambiar de proveedor
        });
    }

    //filtrar productos segun el proveedor seleccionado
    const productosFiltrados = productos.filter((producto) => producto.proveedor_id === Number(data.proveedor_id));
    // Aquí puedes implementar la lógica para filtrar productos según el proveedor seleccionado

    const todosproductosagregados = productosFiltrados.length > 0 && data.items.length >= productosFiltrados.length;

    // 2. Agregar una nueva fila de producto
    const handleAddItem = () => {
        setData('items', [...data.items, { producto_id: '', producto_nombre: '', cantidad: 1, costoProducto: 0 }]);
    };

    // 3. Modificar una fila existente (actualiza producto, cantidad o costo)
    /*const handleItemChange = (index: number, field: keyof DetalleOrden, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Si el usuario cambia el producto, auto-llenamos su costo predeterminado
        if (field === 'producto_id') {
            const selectedProduct = productos.find((p) => p.id === Number(value));
            if (selectedProduct) {
                newItems[index].costoProducto = selectedProduct.costo;
            }
        }

        setData('items', newItems);
    };*/

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Si el campo que cambió fue el nombre del producto:
        if (field === 'producto_nombre') {
            // Buscamos en el catálogo el producto cuyo nombre coincida exactamente
            const foundProduct = productosFiltrados.find((p) => p.nombre.toLowerCase() === value.toLowerCase());

            if (foundProduct) {
                // Si lo encontró, guardamos su ID y autocompletamos su costo
                newItems[index].producto_id = foundProduct.id;
                newItems[index].costoProducto = foundProduct.costo;
            } else {
                // Si escribió algo que no existe en el catálogo, limpiamos el ID
                newItems[index].producto_id = '';
            }
        }

        setData('items', newItems);
    };

    // 4. Eliminar una fila
    const handleRemoveItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    // 5. Calcular el total general de la orden de compra
    const calculateTotal = () => {
        return data.items.reduce((sum, item) => {
            const qty = Number(item.cantidad) || 0;
            const cost = Number(item.costoProducto) || 0;
            return sum + qty * cost;
        }, 0);
    };

    // 6. Enviar el formulario al backend
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/ordenes');
    };

    return (
        <div className="py-12 max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Registrar Orden de Compra a Proveedor</h1>

                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-3">

                    {/* Selección del Proveedor */}
                    <div className="flex flex-col gap-1.5">
                        <label>Proveedor</label>
                        <select
                            value={data.proveedor_id}
                            onChange={handleproveedorChange}//{(e) => setData('proveedor_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" className="text-gray-800 bg-gray-200">Seleccione un proveedor...</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.id} className="text-gray-800 bg-gray-200">
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.proveedor_id && <p className="text-red-500 text-sm mt-1">{errors.proveedor_id}</p>}
                    </div>

                    {/* Listado dinámico de ítems */}
                    <div>
                        <div className="pt-4 border-t space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold ">Productos a Reabastecer</h2>
                                {todosproductosagregados && (
                                    <span className="text-sm text-gray-300">
                                        Todos los productos ya fueron agregados.
                                    </span>)
                                }
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    disabled={data.proveedor_id === '' || todosproductosagregados}
                                    className="bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    + Agregar Producto
                                </button>
                            </div>
                        </div>

                        <div>
                            {data.items.map((item, index) => {
                                const errorMapeo = item.producto_nombre && !item.producto_id;
                                const errores = errors[`items.${index}.producto_id`];
                                const disponibles = producosDisponibles(index);
                                const subtotal = (Number(item.cantidad) || 0) * (Number(item.costoProducto) || 0);
                                return (
                                    <div key={index} className="flex flex-col relative rounded-md border pb-1">
                                        <div className="flex items-end gap-3 p-4">
                                            {/* Selector de producto */}
                                            {/* 1. Campo de texto con autocompletado nativo */}
                                            <div className="w-1/2">
                                                <label>Producto</label>
                                                <input
                                                    type="text"
                                                    list={`product-options-${index}`} // Conecta con el datalist único de esta fila
                                                    value={item.producto_nombre || ''} // Mostramos el nombre escrito
                                                    disabled={data.proveedor_id === ''} // Deshabilitado si no hay proveedor seleccionado
                                                    onChange={(e) => handleItemChange(index, 'producto_nombre', e.target.value)}
                                                    placeholder={data.proveedor_id ? "Escribe para buscar producto..." : "Primero Seleccione un proveedor"}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:cursor-not-allowed disabled:text-red-500 disabled:border-gray-100 ${errorMapeo ? 'border-red-500 focus:ring-red-500' : 'border-gray-500'
                                                        }`}
                                                />


                                                {/* 2. La lista de sugerencias que se alimenta de tu catálogo */}
                                                <datalist id={`product-options-${index}`}>
                                                    {disponibles.map((p) => (
                                                        <option key={p.id} value={p.nombre} className="text-gray-800" />
                                                    ))}
                                                </datalist>
                                                
                                            </div>

                                            {/* Cantidad */}
                                            <div className="flex-1">
                                                <label>Cantidad</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Costo unitario */}
                                            <div className="w-1/4">
                                                <label>Costo Unitario</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.costoProducto}
                                                    onChange={(e) => handleItemChange(index, 'costoProducto', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Subtotal calculado */}
                                            <div className="w-28 text-right pb-2">
                                                <span className="text-xs block">Subtotal</span>
                                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                            </div>

                                            {/* Botón eliminar */}
                                            <div className="px-4 py-3 text-center">
                                                {data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="text-red-600 hover:text-red-900 pb-2 text-sm font-bold px-2"
                                                    >
                                                        <X />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Mensaje de error visual en tiempo real */}
                                        {errores ? (
                                            <span className="text-red-600 text-xs mt-1 font-semibold">{errores}</span>
                                        ) : (
                                            errorMapeo && (
                                                <span className="text-red-500 text-xs mt-1">Producto no encontrado</span>
                                            
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
                    </div>

                    {/* Total General */}
                    <div className="flex justify-end items-center space-x-4 border-t pt-4">
                        <span className="text-lg font-bold text-gray-700">Total de la Compra:</span>
                        <span className="text-2xl font-extrabold text-indigo-600">${calculateTotal().toFixed(2)}</span>
                    </div>

                    {/* Botón de envío */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-3 py-3 bg-gray-100 text-black font-medium rounded-md shadow hover:bg-gray-400 transition disabled:opacity-50 cursor-pointer"
                        >
                            Guardar Orden de Compra
                        </button>
                        <div className="px-3 py-3 bg-gray-800 text-white font-medium rounded-md shadow hover:bg-gray-600 transition disabled:opacity-50 cursor-pointer">
                            <Link href="/proveedores">Cancelar</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}