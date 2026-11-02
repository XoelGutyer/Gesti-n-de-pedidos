import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useForm } from "@inertiajs/react";
import { X } from "lucide-react";

interface Cliente {
    id: number;
    nombre: string;
    email: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
}

interface Props {
    clientes: Cliente[];
    productos: Producto[];
}

export default function create({ clientes, productos }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        cliente_id: '',
        items: [{ producto_id: '', cantidad: 1 }]
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pedidos');
    };

    const agregarProducto = () => { //...data.items representa los productos que ya fueron agregados (una copia)
        setData('items', [...data.items, { producto_id: '', cantidad: 1 }])
    };//modifica items agregando un producto mas y renderiza automaticamente la interfaz

    const cambiarItem = (index: number, campo: string, value: any) => {
        const newItems = [...data.items]; // 1. Creamos una copia del arreglo
        newItems[index] = { ...newItems[index], [campo]: value }; // 2. Modificamos la fila exacta
        setData('items', newItems); // 3. Guardamos el nuevo estado
    };

    const calcularTotal = () => {
        return data.items.reduce((sum, item) => {
            const producto = productos.find((p) => p.id === Number(item.producto_id));
            return sum + (producto ? producto.precio * Number(item.cantidad) : 0);
        }, 0);
    };

    const eliminarItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    return (
        <div className="py-12 max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <form onSubmit={submit} className="space-y-6 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label>Cliente</label>
                        <select
                            id="cliente_id"
                            value={data.cliente_id}
                            onChange={(e) => setData('cliente_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" className="text-gray-800 bg-gray-200">Seleccione un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id} className="text-gray-800 bg-gray-200">
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.cliente_id} className="mt-1" />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold mb-4">Productos del pedido</h3>
                            <button
                                type="button"
                                onClick={agregarProducto}
                                className="bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-700"
                            >
                                Agregar producto
                            </button>
                        </div>
                    </div>

                    <div>
                        {data.items.map((item, index) => {
                            //data.items es como una lista ordenada donde item son los productos e items la posicion
                            const selectedProduct = productos.find(p => p.id === Number(item.producto_id));
                            const subtotal = selectedProduct ? selectedProduct.precio * Number(item.cantidad) : 0;
                            return (
                                <div key={index} className="flex items-end gap-3 p-4 rounded-md border">
                                    <div className="flex-1">
                                        <label>Producto</label>
                                        <select
                                            value={item.producto_id}
                                            onChange={(e) => cambiarItem(index, 'producto_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" className="text-gray-800 bg-gray-200">Seleccione un producto</option>
                                            {productos.map((producto) => (
                                                <option key={producto.id} value={producto.id} className="text-gray-800 bg-gray-200">
                                                    {producto.nombre} - ${producto.precio} (Stock: {producto.stock})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label>Cantidad</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            onChange={(e) => cambiarItem(index, 'cantidad', e.target.value)}
                                        />
                                    </div>

                                    <div className="w-28 text-right pb-2">
                                        <span className="text-xs block">Subtotal</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>

                                    {data.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => eliminarItem(index)}
                                            className="text-red-600 hover:text-red-900 pb-2 text-sm font-bold px-2"
                                            >
                                            <X />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        <div className="flex justify-end pt-4 ">
                            <div className="text-right">
                                <span className=" text-sm mr-4">Total Del pedido</span>
                                <span className="text-2xl font-bold ">${calcularTotal().toFixed(2)}</span>
                            </div>
                        </div>


                    </div>
                    <div>
                        <Link
                            href="/pedidos"
                            className="text-gray-600 hover:text-gray-900 text-sm font-semibold"
                        >Cancelar
                        </Link>
                        <Button disabled={processing}>
                            {processing ? 'Guardando...' : 'Crear Pedido'}
                        </Button>

                    </div>
                </form>
            </div>
        </div>
    )
}