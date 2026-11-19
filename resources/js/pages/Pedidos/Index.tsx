import { Button } from "@/components/ui/button";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

import {
    Check,
    ChevronsUpDown,
    Eye,
    FileText,
    Pencil,
    Plus,
    Search,
    X,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

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
    estado: "pendiente" | "en_preparacion" | "en_camino";
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
    usuario: { id: number; name: string; role: string };
    clientes: { id: number; nombre: string; email?: string | null }[];
    filtros: { desde?: string; hasta?: string; cliente_id?: string };
    flash?: { success?: string };
}
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const ESTADOS = [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_preparacion", label: "En preparación" },
    { value: "en_camino", label: "En camino" },
];

const cambiarEstado = (pedido: Pedido, estado: string) => {
    router.patch(
        `/pedidos/${pedido.id}/estado`,
        { estado },
        { preserveScroll: true },
    );
};

export default function Index({ pedidos, usuario, clientes, filtros, flash }: Props) {

    const [desde, setDesde] = useState(filtros.desde ?? "");
    const [hasta, setHasta] = useState(filtros.hasta ?? "");
    const [clienteId, setClienteId] = useState(filtros.cliente_id ?? "todos");

    const [abierto, setAbierto] = useState(false);
    const clienteSeleccionado = clientes.find(
        (c) => String(c.id) === clienteId,
    );

    const filtrar = () => {
        router.get(
            "/pedidos",
            {
                desde: desde || undefined,
                hasta: hasta || undefined,
                cliente_id: clienteId !== "todos" ? clienteId : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const limpiar = () => {
        setDesde("");
        setHasta("");
        setClienteId("todos");
        router.get("/pedidos", {}, { preserveState: true });
    };
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

            <div className="mb-4 flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Desde</label>
                    <input
                        type="date"
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                        className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Hasta</label>
                    <input
                        type="date"
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                        className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                </div>
                
                {usuario.role ==='admin' && (
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Cliente</label>
                    <Popover open={abierto} onOpenChange={setAbierto}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={abierto}
                                className="h-9 w-[240px] justify-between font-normal"
                            >
                                <span className="truncate">
                                    {clienteSeleccionado?.nombre ??
                                        "Todos los clientes"}
                                </span>
                                <ChevronsUpDown className="size-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[300px] p-0"
                            align="start"
                        >
                            <Command>
                                <CommandInput placeholder="Buscar por nombre o correo..." />
                                <CommandList>
                                    <CommandEmpty>
                                        No se encontró ningún cliente.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="todos los clientes"
                                            onSelect={() => {
                                                setClienteId("todos");
                                                setAbierto(false);
                                            }}
                                        >
                                            Todos los clientes
                                        </CommandItem>
                                        {clientes.map((c) => (
                                            <CommandItem
                                                key={c.id}
                                                value={`${c.nombre} ${c.email ?? ""} ${c.id}`}
                                                onSelect={() => {
                                                    setClienteId(
                                                        String(c.id),
                                                    );
                                                    setAbierto(false);
                                                }}
                                            >
                                                <Check
                                                    className={
                                                        clienteId ===
                                                            String(c.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    }
                                                />
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate">
                                                        {c.nombre}
                                                    </span>
                                                    {c.email && (
                                                        <span className="truncate text-xs text-gray-400">
                                                            {c.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                )}


                <Button onClick={filtrar}>
                    <Search /> Filtrar
                </Button>
                <Button variant="outline" onClick={limpiar}>
                    <X /> Limpiar
                </Button>
            </div>

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
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={pedido.estado}
                                                    onValueChange={(valor) =>
                                                        cambiarEstado(
                                                            pedido,
                                                            valor,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 w-[150px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ESTADOS.map((e) => (
                                                            <SelectItem
                                                                key={e.value}
                                                                value={e.value}
                                                            >
                                                                {e.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    title="Ver detalle"
                                                    aria-label="Ver detalle"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/pedidos/${pedido.id}`}
                                                    >
                                                        <Eye />
                                                    </Link>
                                                </Button>

                                                {!pedido.pagado && (
                                                    <>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8"
                                                            title="Editar ítems"
                                                            aria-label="Editar ítems"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/pedidos/${pedido.id}/editar-items`}
                                                            >
                                                                <Pencil />
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            title="Marcar pagado"
                                                            aria-label="Marcar pagado"
                                                            onClick={() =>
                                                                marcarPagado(
                                                                    pedido,
                                                                )
                                                            }
                                                        >
                                                            <Check />
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
