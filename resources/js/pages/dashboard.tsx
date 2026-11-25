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
import type { ReactNode } from 'react';
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
    total: { label: 'Ventas', color: '#2563eb' },
} satisfies ChartConfig;

// Estilos reutilizables (paleta azul)
const tarjeta = 'border-blue-100 shadow-sm dark:border-blue-900/50';
const encabezado = 'rounded-t-xl bg-blue-50/70 dark:bg-blue-950/40';

function Kpi({
    titulo,
    valor,
    detalle,
    icono: Icono,
    destacado = false,
}: {
    titulo: string;
    valor: string;
    detalle?: string;
    icono: LucideIcon;
    destacado?: boolean;
}) {
    return (
        <Card
            className={
                destacado
                    ? 'border-blue-600 bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-md dark:border-blue-700'
                    : tarjeta
            }
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardDescription className={destacado ? 'text-blue-100' : ''}>{titulo}</CardDescription>
                    <span
                        className={`flex size-8 items-center justify-center rounded-lg ${
                            destacado
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                    >
                        <Icono className="size-4" />
                    </span>
                </div>
                <CardTitle className={`text-2xl tabular-nums ${destacado ? '' : 'text-blue-950 dark:text-white'}`}>
                    {valor}
                </CardTitle>
            </CardHeader>
            {detalle && (
                <CardContent className={`text-xs ${destacado ? 'text-blue-100' : 'text-muted-foreground'}`}>
                    {detalle}
                </CardContent>
            )}
        </Card>
    );
}

function TituloConIcono({
    icono: Icono,
    children,
    className,
}: {
    icono: LucideIcon;
    children: ReactNode;
    className?: string;
}) {
    return (
        <CardTitle className="flex items-center gap-2 text-blue-950 dark:text-blue-100">
            <Icono className={`size-4 ${className ?? 'text-blue-600 dark:text-blue-400'}`} />
            {children}
        </CardTitle>
    );
}

export default function Dashboard({ kpis, ventasPorDia, ultimosPedidos, masVendidos, stockBajo }: Props) {
    const maxUnidades = Math.max(...masVendidos.map((m) => Number(m.unidades)), 1);

    return (
        <>
            <Head title="Panel" />
            <div className="flex flex-col gap-4 p-4">
                {/* Indicadores */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Kpi
                        destacado
                        icono={TrendingUp}
                        titulo="Vendido este mes"
                        valor={peso.format(kpis.ventasMes)}
                    />
                    <Kpi
                        icono={CreditCard}
                        titulo="Cobrado online este mes"
                        valor={peso.format(kpis.cobradoMes)}
                        detalle="Pedidos pagados con Mercado Pago"
                    />
                    <Kpi icono={ShoppingBag} titulo="Pedidos de hoy" valor={String(kpis.pedidosHoy)} />
                    <Kpi icono={Clock} titulo="Pendientes de pago" valor={String(kpis.pendientesPago)} />
                </div>

                {/* Gráfico */}
                <Card className={tarjeta}>
                    <CardHeader className={encabezado}>
                        <TituloConIcono icono={CalendarDays}>Ventas de los últimos 14 días</TituloConIcono>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ChartContainer config={chartConfig} className="h-[260px] w-full">
                            <BarChart data={ventasPorDia}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="total" fill="var(--color-total)" radius={6} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Últimos pedidos */}
                    <Card className={`${tarjeta} overflow-hidden lg:col-span-2`}>
                        <CardHeader className={encabezado}>
                            <TituloConIcono icono={ClipboardList}>Últimos pedidos</TituloConIcono>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-600 hover:bg-blue-600 dark:bg-blue-900/70 dark:hover:bg-blue-900/70">
                                        <TableHead className="rounded-tl-md text-white">#</TableHead>
                                        <TableHead className="text-white">Fecha</TableHead>
                                        <TableHead className="text-white">Cliente</TableHead>
                                        <TableHead className="text-right text-white">Total</TableHead>
                                        <TableHead className="rounded-tr-md text-white">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ultimosPedidos.map((p) => (
                                        <TableRow key={p.id} className="hover:bg-blue-50/70 dark:hover:bg-blue-950/40">
                                            <TableCell className="font-semibold text-blue-700 dark:text-blue-300">
                                                #{p.id}
                                            </TableCell>
                                            <TableCell>{p.formato_fecha}</TableCell>
                                            <TableCell>{p.cliente}</TableCell>
                                            <TableCell className="text-right font-semibold tabular-nums">
                                                {peso.format(p.total)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`gap-1 ${
                                                        p.pagado
                                                            ? 'bg-blue-600 text-white hover:bg-blue-600'
                                                            : 'bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-950'
                                                    }`}
                                                >
                                                    {p.pagado ? (
                                                        <CircleCheck className="size-3" />
                                                    ) : (
                                                        <Clock className="size-3" />
                                                    )}
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
                        {/* Más vendidos */}
                        <Card className={tarjeta}>
                            <CardHeader className={encabezado}>
                                <TituloConIcono icono={Package}>Más vendidos del mes</TituloConIcono>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 pt-4 text-sm">
                                {masVendidos.length === 0 && (
                                    <p className="text-muted-foreground">Sin ventas este mes.</p>
                                )}
                                {masVendidos.map((m, idx) => {
                                    const unidades = Number(m.unidades);

                                    return (
                                        <div key={m.nombre} className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="flex min-w-0 items-center gap-2">
                                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="truncate">{m.nombre}</span>
                                                </span>
                                                <span className="font-medium text-blue-700 tabular-nums dark:text-blue-300">
                                                    {unidades} u.
                                                </span>
                                            </div>
                                            <div className="h-1.5 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{ width: `${(unidades / maxUnidades) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Stock bajo: se destaca como alerta cuando hay productos */}
                        {stockBajo.length > 0 ? (
                            <Card className="overflow-hidden border-2 border-amber-400 bg-amber-50 shadow-md shadow-amber-500/10 dark:border-amber-500/70 dark:bg-amber-950/30">
                                <CardHeader className="bg-amber-400 dark:bg-amber-500">
                                    <CardTitle className="flex items-center justify-between gap-2 text-amber-950">
                                        <span className="flex items-center gap-2">
                                            <TriangleAlert className="size-5 animate-pulse" />
                                            Stock bajo
                                        </span>
                                        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-amber-700">
                                            {stockBajo.length} {stockBajo.length === 1 ? 'producto' : 'productos'}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2 pt-4 text-sm">
                                    {[...stockBajo]
                                        .sort((a, b) => a.stock - b.stock)
                                        .map((s) => (
                                            <div
                                                key={s.id}
                                                className={`flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm dark:bg-slate-900 ${
                                                    s.stock === 0
                                                        ? 'border-red-300 border-l-4 border-l-red-600 dark:border-red-900'
                                                        : 'border-amber-200 border-l-4 border-l-amber-500 dark:border-amber-900'
                                                }`}
                                            >
                                                <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                                                    {s.nombre}
                                                </span>
                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums text-white ${
                                                        s.stock === 0 ? 'bg-red-600' : 'bg-amber-500'
                                                    }`}
                                                >
                                                    {s.stock === 0 ? 'Agotado' : `${s.stock} u.`}
                                                </span>
                                            </div>
                                        ))}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className={tarjeta}>
                                <CardHeader className={encabezado}>
                                    <TituloConIcono icono={CircleCheck}>Stock</TituloConIcono>
                                </CardHeader>
                                <CardContent className="pt-4 text-sm text-muted-foreground">
                                    Todo en orden.
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}