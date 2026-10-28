import React, { FormEvent } from 'react';
import { useForm, Head, router, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Plus } from 'lucide-react';


interface Usuario{
    id:number;
    name: string;
}

interface Cliente {
    id: number;
    nombre: string;
    direccion: string;
    email: string;
    dia:string;
    celular: string;
    usuario: Usuario | null;
}

interface Props {
    clientes: Cliente[];
}

// interface CustomerForm {
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
//     is_active: boolean;
// }

export default function Index({ clientes }: Props) {

    // const submit = (e: FormEvent) => {
    //     e.preventDefault();
    //     put('/clientes/${clientes.id}');
    // };

    const eliminar = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            router.delete(`/clientes/${id}`,{
                preserveScroll:true,
            });
        }
    };

    return (
        <div>
            {/*user={auth.user}*/}
            <Head title="Clientes" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cliente</h1>
                    <h4 className="text-sm mt-1 text-gray-600 dark:text-gray-400">Lista de Clientes</h4>

                    <Button asChild>
                        <Link href="/clientes/create">
                            <Plus />
                            Nuevo cliente
                        </Link>
                    </Button>
                </div>

                {/* Tabla de Clientes */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">


                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">id</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Nombre</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Direccion</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Email</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Dia</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Celular</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Usuario</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {clientes.length > 0 ? (

                                    clientes.map((cliente) => (
                                        <tr key={cliente.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{cliente.id}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{cliente.nombre}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{cliente.direccion}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{cliente.email}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{cliente.dia}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{cliente.celular}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                
                                                {cliente.usuario ? (
                                                    <span>{cliente.usuario.name}</span>
                                                ) :(
                                                    <span>-</span>
                                                ) }</td>
                                            {/*<td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                             <span
                                                className={`px-2 py-1 rounded-md text-xs font-semibold ${customer.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {customer.is_active ? 'Activo' : 'Inactivo'}
                                            </span> 
                                        </td>*/}
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/clientes/${cliente.id}/edit`}
                                                        >
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                    <button
                                                        onClick={() => eliminar(cliente.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No hay clientes registrados.
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}