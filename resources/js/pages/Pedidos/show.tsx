import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, CircleCheck, Clock, FileText, Pencil } from 'lucide-react';

interface Item {
    id: number;
    producto: string;
    cantidad: number;
    unitario: number;
    descuento: number;
    costo: number;
    subtotal: number;
}
interface Pedido {
    id: number;
    fecha: string;
    nota: string | null;
    cliente: string;
    direccion: string;
    total: number;
    pagado: boolean;
    mp_payment_id: string | null;
    registrado_por: string | null;
    items: Item[];
}

const peso = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

// Estilos reutilizables (paleta azul)
const tarjeta = 'border-blue-100 shadow-sm dark:border-blue-900/50';
const botonPrimario = 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500';
const botonContorno =
    'border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 ' +
    'dark:border-blue-800 dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-200';

export default function Show({ pedido }: { pedido: Pedido }) {
    const unidades = pedido.items.reduce((s, i) => s + i.cantidad, 0);
    const costo = pedido.items.reduce((s, i) => s + i.cantidad * i.costo, 0);
    const ganancia = pedido.total - costo;

    const marcarPagado = () => {
        if (!confirm(`¿Marcar el pedido #${pedido.id} como pagado?`)) return;
        router.patch(`/pedidos/${pedido.id}/marcar-pagado`, {}, { preserveScroll: true });
    };

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
            <Head title={`Pedido #${pedido.id}`} />

            <Button
                variant="ghost"
                size="sm"
                className="w-fit text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                asChild
            >
                <Link href="/pedidos">
                    <ArrowLeft /> Volver a pedidos
                </Link>
            </Button>

            {/* Encabezado */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pedido #{pedido.id}</h1>
                    <Badge
                        className={`gap-1 ${
                            pedido.pagado
                                ? 'bg-blue-600 text-white hover:bg-blue-600'
                                : 'bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-950'
                        }`}
                    >
                        {pedido.pagado ? <CircleCheck className="size-3" /> : <Clock className="size-3" />}
                        {pedido.pagado ? 'Pagado' : 'Pendiente de pago'}
                    </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        className={botonContorno}
                        onClick={() => window.open(`/pedidos/remitos?ids[]=${pedido.id}`, '_blank')}
                    >
                        <FileText /> Remito
                    </Button>
                    {!pedido.pagado && (
                        <>
                            <Button variant="outline" className={botonContorno} asChild>
                                <Link href={`/pedidos/${pedido.id}/editar-items`}>
                                    <Pencil /> Editar ítems
                                </Link>
                            </Button>
                            <Button className={botonPrimario} onClick={marcarPagado}>
                                <Check /> Marcar pagado
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Datos del pedido */}
            <Card className={tarjeta}>
                <CardHeader className="rounded-t-xl bg-blue-50/70 dark:bg-blue-950/40">
                    <CardTitle className="text-blue-900 dark:text-blue-200">Datos del pedido</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-x-8 gap-y-4 pt-2 text-sm sm:grid-cols-2">
                    <Dato titulo="Cliente" valor={pedido.cliente} />
                    <Dato titulo="Dirección" valor={pedido.direccion} />
                    <Dato titulo="Fecha" valor={pedido.fecha} />
                    <Dato titulo="Cargado por" valor={pedido.registrado_por ?? '—'} />
                    <Dato
                        titulo="Forma de pago"
                        valor={pedido.mp_payment_id ? `Mercado Pago (operación ${pedido.mp_payment_id})` : '—'}
                    />
                    <Dato titulo="Nota" valor={pedido.nota || '—'} />
                </CardContent>
            </Card>

            {/* Productos */}
            <Card className={`${tarjeta} overflow-hidden`}>
                <CardHeader className="bg-blue-50/70 dark:bg-blue-950/40">
                    <CardTitle className="text-blue-900 dark:text-blue-200">Productos</CardTitle>
                    <CardDescription>
                        {pedido.items.length} producto(s), {unidades} unidad(es)
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-600 hover:bg-blue-600 dark:bg-blue-900/70 dark:hover:bg-blue-900/70">
                                <TableHead className="rounded-tl-md text-white">Producto</TableHead>
                                <TableHead className="text-right text-white">Cantidad</TableHead>
                                <TableHead className="text-right text-white">Precio unit.</TableHead>
                                <TableHead className="text-right text-white">Desc.</TableHead>
                                <TableHead className="rounded-tr-md text-right text-white">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedido.items.map((i) => (
                                <TableRow key={i.id} className="hover:bg-blue-50/70 dark:hover:bg-blue-950/40">
                                    <TableCell className="font-medium">{i.producto}</TableCell>
                                    <TableCell className="text-right tabular-nums">{i.cantidad}</TableCell>
                                    <TableCell className="text-right tabular-nums">{peso.format(i.unitario)}</TableCell>
                                    <TableCell className="text-right">
                                        {i.descuento > 0 ? (
                                            <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 tabular-nums dark:bg-sky-950 dark:text-sky-300">
                                                -{i.descuento}%
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-blue-700 tabular-nums dark:text-blue-300">
                                        {peso.format(i.subtotal)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Resumen */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-blue-600 bg-blue-600 text-white shadow-sm dark:border-blue-700 dark:bg-blue-700">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-blue-100">Total</CardDescription>
                        <CardTitle className="text-2xl tabular-nums">{peso.format(pedido.total)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className={tarjeta}>
                    <CardHeader className="pb-2">
                        <CardDescription>Costo</CardDescription>
                        <CardTitle className="text-2xl text-blue-900 tabular-nums dark:text-blue-200">
                            {peso.format(costo)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className={tarjeta}>
                    <CardHeader className="pb-2">
                        <CardDescription>Ganancia</CardDescription>
                        <CardTitle
                            className={`text-2xl tabular-nums ${ganancia < 0 ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400'}`}
                        >
                            {peso.format(ganancia)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
    return (
        <div>
            <div className="text-xs font-medium text-blue-700/80 dark:text-blue-300/80">{titulo}</div>
            <div className="text-slate-900 dark:text-slate-100">{valor}</div>
        </div>
    );
}