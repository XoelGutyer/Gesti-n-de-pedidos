import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    CircleCheck,
    Clock,
    ClipboardList,
    CreditCard,
    Package,
    ShoppingBag,
    TrendingUp,
    TriangleAlert,
    type LucideIcon,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type Props = {
    kpis: { ventasMes: number; cobradoMes: number; pedidosHoy: number; pendientesPago: number };
    ventasPorDia: { dia: string; total: number }[];
    ultimosPedidos: { id: number; formato_fecha: string; cliente: string; total: number; pagado: boolean }[];
    masVendidos: { nombre: string; unidades: number | string }[];
    stockBajo: { id: number; nombre: string; stock: number }[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Panel', href: dashboard().url }];

const peso = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

const chartConfig = {
    total: { label: 'Ventas', color: 'var(--chart-1)' },
} satisfies ChartConfig;

function Kpi({
    titulo,
    valor,
    detalle,
    icono: Icono,
}: {
    titulo: string;
    valor: string;
    detalle?: string;
    icono: LucideIcon;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardDescription>{titulo}</CardDescription>
                    <Icono className="size-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl tabular-nums">{valor}</CardTitle>
            </CardHeader>
            {detalle && <CardContent className="text-xs text-muted-foreground">{detalle}</CardContent>}
        </Card>
    );
}

function TituloConIcono({ icono: Icono, children, className }: { icono: LucideIcon; children: React.ReactNode; className?: string }) {
    return (
        <CardTitle className="flex items-center gap-2">
            <Icono className={`size-4 ${className ?? 'text-muted-foreground'}`} />
            {children}
        </CardTitle>
    );
}

export default function Dashboard({ kpis, ventasPorDia, ultimosPedidos, masVendidos, stockBajo }: Props) {
    return (
        <>
            <Head title="Panel" />
            <div className="flex flex-col gap-4 p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Kpi icono={TrendingUp} titulo="Vendido este mes" valor={peso.format(kpis.ventasMes)} />
                    <Kpi
                        icono={CreditCard}
                        titulo="Cobrado online este mes"
                        valor={peso.format(kpis.cobradoMes)}
                        detalle="Pedidos pagados con Mercado Pago"
                    />
                    <Kpi icono={ShoppingBag} titulo="Pedidos de hoy" valor={String(kpis.pedidosHoy)} />
                    <Kpi icono={Clock} titulo="Pendientes de pago" valor={String(kpis.pendientesPago)} />
                </div>

                <Card>
                    <CardHeader>
                        <TituloConIcono icono={CalendarDays}>Ventas de los últimos 14 días</TituloConIcono>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[260px] w-full">
                            <BarChart data={ventasPorDia}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <TituloConIcono icono={ClipboardList}>Últimos pedidos</TituloConIcono>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ultimosPedidos.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.id}</TableCell>
                                            <TableCell>{p.formato_fecha}</TableCell>
                                            <TableCell>{p.cliente}</TableCell>
                                            <TableCell className="text-right tabular-nums">{peso.format(p.total)}</TableCell>
                                            <TableCell>
                                                <Badge variant={p.pagado ? 'default' : 'secondary'} className="gap-1">
                                                    {p.pagado ? <CircleCheck className="size-3" /> : <Clock className="size-3" />}
                                                    {p.pagado ? 'Pagado' : 'Pendiente'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardHeader>
                                <TituloConIcono icono={Package}>Más vendidos del mes</TituloConIcono>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 text-sm">
                                {masVendidos.length === 0 && <p className="text-muted-foreground">Sin ventas este mes.</p>}
                                {masVendidos.map((m) => (
                                    <div key={m.nombre} className="flex justify-between gap-2">
                                        <span className="truncate">{m.nombre}</span>
                                        <span className="tabular-nums text-muted-foreground">{Number(m.unidades)} u.</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <TituloConIcono icono={TriangleAlert} className="text-amber-500">
                                    Stock bajo
                                </TituloConIcono>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 text-sm">
                                {stockBajo.length === 0 && <p className="text-muted-foreground">Todo en orden.</p>}
                                {stockBajo.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between gap-2">
                                        <span className="truncate">{s.nombre}</span>
                                        <Badge variant={s.stock === 0 ? 'destructive' : 'secondary'}>{s.stock}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}