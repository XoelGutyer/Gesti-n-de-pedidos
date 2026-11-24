import { Combobox } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FormEventHandler } from 'react';

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

const itemVacio: DetalleOrden = {
    producto_id: '',
    producto_nombre: '',
    cantidad: 1,
    costoProducto: 0,
};

export default function Create({ proveedores, productos }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        proveedor_id: '',
        items: [{ ...itemVacio }] as DetalleOrden[],
    });

    // Opciones del combobox de proveedores (ordenadas alfabéticamente)
    const proveedorOptions = proveedores
        .map((p) => ({ value: String(p.id), label: p.nombre }))
        .sort((a, b) => a.label.localeCompare(b.label));

    // Productos del proveedor seleccionado
    const productosFiltrados = productos.filter(
        (producto) => producto.proveedor_id === Number(data.proveedor_id),
    );

    const todosproductosagregados =
        productosFiltrados.length > 0 && data.items.length >= productosFiltrados.length;

    // Productos que todavía se pueden elegir en una fila (excluye los de las otras filas)
    const productosDisponibles = (indexActual: number) => {
        const idsElegidos = data.items
            .filter((_, index) => index !== indexActual)
            .map((item) => item.producto_id)
            .filter(Boolean);
        return productosFiltrados.filter((producto) => !idsElegidos.includes(producto.id));
    };

    // Al cambiar de proveedor se reinician los productos
    const handleproveedorChange = (id: string) => {
        setData({
            ...data,
            proveedor_id: id,
            items: [{ ...itemVacio }],
        });
    };

    const handleAddItem = () => {
        setData('items', [...data.items, { ...itemVacio }]);
    };

    // Al elegir un producto guarda id y nombre, y autocompleta el costo
    const seleccionarProducto = (index: number, id: string) => {
        const producto = productosFiltrados.find((p) => p.id === Number(id));
        const newItems = [...data.items];
        newItems[index] = {
            ...newItems[index],
            producto_id: producto ? producto.id : '',
            producto_nombre: producto ? producto.nombre : '',
            costoProducto: producto ? producto.costo : 0,
        };
        setData('items', newItems);
    };

    // Cantidad y costo
    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleRemoveItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => {
            const qty = Number(item.cantidad) || 0;
            const cost = Number(item.costoProducto) || 0;
            return sum + qty * cost;
        }, 0);
    };

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
                        <Combobox
                            options={proveedorOptions}
                            value={data.proveedor_id}
                            onChange={handleproveedorChange}
                            placeholder="Seleccione un proveedor..."
                            searchPlaceholder="Buscar proveedor..."
                            emptyText="No se encontraron proveedores."
                        />
                        {errors.proveedor_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.proveedor_id}</p>
                        )}
                    </div>

                    {/* Listado dinámico de ítems */}
                    <div>
                        <div className="pt-4 border-t space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Productos a Reabastecer</h2>
                                {todosproductosagregados && (
                                    <span className="text-sm text-gray-300">
                                        Todos los productos ya fueron agregados.
                                    </span>
                                )}
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
                                const errores = errors[`items.${index}.producto_id` as keyof typeof errors];
                                const disponibles = productosDisponibles(index);
                                const subtotal =
                                    (Number(item.cantidad) || 0) * (Number(item.costoProducto) || 0);

                                return (
                                    <div key={index} className="flex flex-col relative rounded-md border pb-1">
                                        <div className="flex items-end gap-3 p-4">
                                            {/* Producto */}
                                            <div className="w-1/2">
                                                <label>Producto</label>
                                                <Combobox
                                                    options={disponibles.map((p) => ({
                                                        value: String(p.id),
                                                        label: p.nombre,
                                                    }))}
                                                    value={String(item.producto_id)}
                                                    onChange={(v) => seleccionarProducto(index, v)}
                                                    disabled={data.proveedor_id === ''}
                                                    placeholder={
                                                        data.proveedor_id
                                                            ? 'Seleccione un producto...'
                                                            : 'Primero seleccione un proveedor'
                                                    }
                                                    searchPlaceholder="Buscar producto..."
                                                    emptyText="No hay productos disponibles."
                                                />
                                            </div>

                                            {/* Cantidad */}
                                            <div className="flex-1">
                                                <label>Cantidad</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) =>
                                                        handleItemChange(index, 'cantidad', e.target.value)
                                                    }
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
                                                    onChange={(e) =>
                                                        handleItemChange(index, 'costoProducto', e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Subtotal */}
                                            <div className="w-28 text-right pb-2">
                                                <span className="text-xs block">Subtotal</span>
                                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                            </div>

                                            {/* Eliminar */}
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

                                        {errores && (
                                            <span className="text-red-600 text-xs mt-1 font-semibold">
                                                {errores}
                                            </span>
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
                        <span className="text-2xl font-extrabold text-indigo-600">
                            ${calculateTotal().toFixed(2)}
                        </span>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-3 py-3 bg-gray-100 text-black font-medium rounded-md shadow hover:bg-gray-400 transition disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? 'Guardando...' : 'Guardar Orden de Compra'}
                        </button>
                        <Button variant="outline" asChild>
                            <Link href="/ordenes">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}