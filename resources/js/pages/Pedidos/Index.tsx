import { Button } from "@/components/ui/button";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

import {
    Check,
    ChevronsUpDown,
    Eye,
    FileText,
    Package,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DetallePedido {
    id: number;
    cantidad: number;
    precioProducto: number;
    descuento: number;
    costoProducto: number;
    subtotal: number;
    producto_id: number;
    producto: {
        nombre: string;
    };
}

type Estado = "pendiente" | "en_preparacion" | "en_camino" | "entregado";

interface Pedido {
    id: number;
    formato_fecha: string;
    nota: string;
    total: number;
    pagado: boolean;
    estado: Estado;
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

const ESTADOS: { value: Estado; label: string; clase: string }[] = [
    {
        value: "pendiente",
        label: "Pendiente",
        clase: "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600",
    },
    {
        value: "en_preparacion",
        label: "En preparación",
        clase: "bg-sky-100 text-sky-700 ring-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800",
    },
    {
        value: "en_camino",
        label: "En camino",
        clase: "bg-blue-100 text-blue-700 ring-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800",
    },
    {
        value: "entregado",
        label: "Entregado",
        clase: "bg-indigo-100 text-indigo-700 ring-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-800",
    },
];

const cambiarEstado = (pedido: Pedido, estado: string) => {
    router.patch(
        `/pedidos/${pedido.id}/estado`,
        { estado },
        { preserveScroll: true },
    );
};

// Estilos reutilizables (paleta azul)
const inputFecha =
    "h-9 rounded-md border border-blue-200 bg-white px-3 text-sm text-slate-900 " +
    "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 " +
    "dark:border-blue-900 dark:bg-slate-900 dark:text-white dark:[color-scheme:dark]";

const botonPrimario =
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500";

const botonContorno =
    "border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 " +
    "dark:border-blue-800 dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-200";

export default function Index({
    pedidos,
    usuario,
    clientes,
    filtros,
    flash,
}: Props) {
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

    const esAdmin = usuario.role === "admin";

    return (
        <div className="p-6">
            <Head title="Pedidos" />

            {/* Encabezado */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <Package className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {esAdmin ? "Pedidos" : "Mis pedidos"}
                        </h1>
                        <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                            {pedidos.length} pedido(s)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {seleccion.length > 0 && (
                        <Button
                            variant="outline"
                            className={botonContorno}
                            onClick={() => abrirRemitos(seleccion)}
                        >
                            <FileText />
                            Crear remitos ({seleccion.length})
                        </Button>
                    )}
                    <Button asChild className={botonPrimario}>
                        <Link href="/pedidos/create">
                            <Plus />
                            Nuevo pedido
                        </Link>
                    </Button>
                </div>
            </div>

            {flash?.success && (
                <div
                    className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    role="alert"
                >
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            {/* Filtros */}
            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-blue-800 dark:text-blue-300">
                        Desde
                    </label>
                    <input
                        type="date"
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                        className={inputFecha}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-blue-800 dark:text-blue-300">
                        Hasta
                    </label>
                    <input
                        type="date"
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                        className={inputFecha}
                    />
                </div>

                {esAdmin && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-blue-800 dark:text-blue-300">
                            Cliente
                        </label>
                        <Popover open={abierto} onOpenChange={setAbierto}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={abierto}
                                    className={`h-9 w-[240px] justify-between font-normal ${botonContorno}`}
                                >
                                    <span className="truncate">
                                        {clienteSeleccionado?.nombre ??
                                            "Todos los clientes"}
                                    </span>
                                    <ChevronsUpDown className="size-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-[300px] border-blue-200 p-0 dark:border-blue-900"
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
                                                                ? "text-blue-600 opacity-100"
                                                                : "opacity-0"
                                                        }
                                                    />
                                                    <div className="flex min-w-0 flex-col">
                                                        <span className="truncate">
                                                            {c.nombre}
                                                        </span>
                                                        {c.email && (
                                                            <span className="truncate text-xs text-slate-400">
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

                <Button onClick={filtrar} className={botonPrimario}>
                    <Search /> Filtrar
                </Button>
                <Button
                    variant="outline"
                    onClick={limpiar}
                    className={botonContorno}
                >
                    <X /> Limpiar
                </Button>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-blue-100 bg-blue-600 dark:border-blue-900/50 dark:bg-blue-900/70">
                            <tr>
                                <th className="w-10 px-4 py-4">
                                    <input
                                        type="checkbox"
                                        className="size-4 accent-blue-300"
                                        checked={todos}
                                        onChange={alternarTodos}
                                        aria-label="Seleccionar todos"
                                    />
                                </th>
                                {[
                                    "ID",
                                    "Cliente",
                                    "Fecha",
                                    "Estado",
                                    "Pagado",
                                    "Total",
                                    "Acciones",
                                ].map((t) => (
                                    <th
                                        key={t}
                                        className="px-6 py-4 font-semibold text-white"
                                    >
                                        {t}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.length > 0 ? (
                                pedidos.map((pedido) => {
                                    const estado = ESTADOS.find(
                                        (e) => e.value === pedido.estado,
                                    );

                                    return (
                                        <tr
                                            key={pedido.id}
                                            className="border-b border-blue-50 transition-colors last:border-b-0 hover:bg-blue-50/70 dark:border-slate-800 dark:hover:bg-blue-950/40"
                                        >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    className="size-4 accent-blue-600"
                                                    checked={seleccion.includes(
                                                        pedido.id,
                                                    )}
                                                    onChange={() =>
                                                        alternar(pedido.id)
                                                    }
                                                    aria-label={`Seleccionar pedido ${pedido.id}`}
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-blue-700 dark:text-blue-300">
                                                #{pedido.id}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                                {pedido.cliente.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {pedido.formato_fecha}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${estado?.clase ?? ""}`}
                                                >
                                                    {estado?.label ??
                                                        pedido.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                                        pedido.pagado
                                                            ? "bg-blue-600 text-white ring-blue-600"
                                                            : "bg-white text-slate-600 ring-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-600"
                                                    }`}
                                                >
                                                    {pedido.pagado
                                                        ? "Pagado"
                                                        : "Sin pagar"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold tabular-nums text-slate-900 dark:text-white">
                                                $
                                                {Number(pedido.total).toFixed(
                                                    2,
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {esAdmin && (
                                                        <Select
                                                            value={
                                                                pedido.estado
                                                            }
                                                            onValueChange={(
                                                                valor,
                                                            ) =>
                                                                cambiarEstado(
                                                                    pedido,
                                                                    valor,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-8 w-[150px] border-blue-200 dark:border-blue-800">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {ESTADOS.map(
                                                                    (e) => (
                                                                        <SelectItem
                                                                            key={
                                                                                e.value
                                                                            }
                                                                            value={
                                                                                e.value
                                                                            }
                                                                        >
                                                                            {
                                                                                e.label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}

                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className={`h-8 w-8 ${botonContorno}`}
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

                                                    {!pedido.pagado &&
                                                        esAdmin && (
                                                            <>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className={`h-8 w-8 ${botonContorno}`}
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
                                                                    className={`h-8 w-8 ${botonPrimario}`}
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
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        <Package className="mx-auto mb-2 size-8 text-blue-300 dark:text-blue-800" />
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