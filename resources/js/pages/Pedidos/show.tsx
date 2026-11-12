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

            <Button variant="ghost" size="sm" className="w-fit" asChild>
                <Link href="/pedidos">
                    <ArrowLeft /> Volver a pedidos
                </Link>
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">Pedido #{pedido.id}</h1>
                    <Badge variant={pedido.pagado ? 'default' : 'secondary'} className="gap-1">
                        {pedido.pagado ? <CircleCheck className="size-3" /> : <Clock className="size-3" />}
                        {pedido.pagado ? 'Pagado' : 'Pendiente de pago'}
                    </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => window.open(`/pedidos/remitos?ids[]=${pedido.id}`, '_blank')}>
                        <FileText /> Remito
                    </Button>
                    {!pedido.pagado && (
                        <>
                            <Button variant="outline" asChild>
                                <Link href={`/pedidos/${pedido.id}/editar-items`}>
                                    <Pencil /> Editar ítems
                                </Link>
                            </Button>
                            <Button onClick={marcarPagado}>
                                <Check /> Marcar pagado
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos del pedido</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
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

            <Card>
                <CardHeader>
                    <CardTitle>Productos</CardTitle>
                    <CardDescription>
                        {pedido.items.length} producto(s), {unidades} unidad(es)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-right">Cantidad</TableHead>
                                <TableHead className="text-right">Precio unit.</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedido.items.map((i) => (
                                <TableRow key={i.id}>
                                    <TableCell>{i.producto}</TableCell>
                                    <TableCell className="text-right tabular-nums">{i.cantidad}</TableCell>
                                    <TableCell className="text-right tabular-nums">{peso.format(i.unitario)}</TableCell>
                                    <TableCell className="text-right tabular-nums">{peso.format(i.subtotal)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total</CardDescription>
                        <CardTitle className="text-2xl tabular-nums">{peso.format(pedido.total)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Costo</CardDescription>
                        <CardTitle className="text-2xl tabular-nums">{peso.format(costo)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Ganancia</CardDescription>
                        <CardTitle className={`text-2xl tabular-nums ${ganancia < 0 ? 'text-red-600' : 'text-green-600'}`}>
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
            <div className="text-xs text-muted-foreground">{titulo}</div>
            <div>{valor}</div>
        </div>
    );
}