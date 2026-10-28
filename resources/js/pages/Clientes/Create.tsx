import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

interface DiaOpcion{
    value: string;
    label: string;
}

interface Props{
    opcionesDeDias: DiaOpcion[];
}

export default function create({ opcionesDeDias }:Props) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        direccion: '',
        email: '',
        dia: '',
        celular: '',
        crear_usuario: false,
        name: '',
        contraseña: '',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/clientes');
    }
    return (
        <div className="p-6"> 
            <div className="mx-auto max-w-2xl ">
                <Head title="Nuevo cliente"/>
                
                {/* Formulario de Registro */}
                <div className="p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Registrar Nuevo Cliente</h3>

                    <form onSubmit={submit} className="flex flex-col gap-3">

                        {/* Nombre */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Nombre</label>
                            <Input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nombre del cliente"
                            />
                            <InputError message={errors.nombre} className="mt-1" />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email del cliente"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Dia de la semana</label>
                            <select
                                id="dia"
                                value={data.dia}
                                onChange={(e) => setData('dia', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" className="text-gray-800 bg-gray-200">Seleccione un Dia</option>
                                {opcionesDeDias.map((option)=>(
                                    <option key={option.value} value={option.value} className="text-gray-800 bg-gray-200">{option.value}</option>
                                ))}
                            </select>
                            <InputError message={errors.dia} className="mt-1" />
                        </div>

                        {/* Teléfono */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Celular</label>
                            <Input
                                id="phone"
                                type="text"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Numero de celular del cliente"
                            />
                            <InputError message={errors.celular} className="mt-1" />
                        </div>

                        {/* Dirección */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Domicilio</label>
                            <Input
                                id="address"
                                type="text"
                                value={data.direccion}
                                onChange={(e) => setData('direccion', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Domicilio del Cliente"
                            />
                            <InputError message={errors.direccion} className="mt-1" />
                        </div>

                        <div>
                            <div className="flex gap-1.5">
                                <label className="text-sm font-medium">¿Tiene una cuenta?</label>
                                <input
                                    id='crear_usuario'
                                    type='checkbox'
                                    checked={data.crear_usuario}
                                    onChange={(e) => setData('crear_usuario', e.target.checked)}
                                    className=" px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div >
                            {data.crear_usuario ? (
                                <span>Se usara el correo del formulario para vincular su cuenta.</span>
                            ) : (
                                <div className="pt-3 flex flex-col gap-1.5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium">Nombre de usuario</label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nombre de usuario"
                                        />                                        
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium">Contraseña</label>
                                        <Input
                                            id="contraseña"
                                            type="password"
                                            value={data.contraseña}
                                            onChange={(e) => setData('contraseña', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Insertar contraseña"
                                        />                                        
                                    </div>                                    
                                </div>

                            )}
                        </div>

                        {/* Botón de Enviar */}
                        <div className="md:col-span-2 flex justify-end">
                            <Button disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar Cliente'}
                            </Button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}
