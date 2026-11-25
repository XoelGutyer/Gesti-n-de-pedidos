import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, router } from '@inertiajs/react';
import { Download, Package, Search, Truck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type Producto = { id: number; nombre: string; unidades: number; monto: number; costo: number; ganancia: number };
type Proveedor = {
    id: number;
    nombre: string;
    unidades: number;
    monto: number;
    costo: number;
    ganancia: number;
    productos: Producto[];
};

type Props = {
    desde: string;
    hasta: string;
    proveedores: Proveedor[];
    totales: { unidades: number; monto: number; costo: number; ganancia: number };
};

const BASE = '/reportes/ventas-proveedores';
const peso = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

const margen = (ganancia: number, monto: number) =>
    monto > 0 ? `${((ganancia / monto) * 100).toFixed(1)}%` : '—';

const colorGanancia = (n: number) => (n < 0 ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400');

// Estilos reutilizables (paleta azul)
const tarjeta = 'border-blue-100 shadow-sm dark:border-blue-900/50';
const encabezado = 'rounded-t-xl bg-blue-50/70 dark:bg-blue-950/40';
const botonPrimario = 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500';
const botonContorno =
    'border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 ' +
    'dark:border-blue-800 dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-200';
const inputAzul =
    'border-blue-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 dark:border-blue-900';

export default function VentasProveedores({ desde, hasta, proveedores, totales }: Props) {
    const [rango, setRango] = useState({ desde, hasta });

    const filtrar = (e: FormEvent) => {
        e.preventDefault();
        router.get(BASE, rango, { preserveState: true, preserveScroll: true });
    };

    const params = new URLSearchParams(rango).toString();

    return (
        <>
            <Head title="Ventas por proveedor" />
            <div className="flex flex-col gap-4 p-4">
                {/* Filtros */}
                <Card className={tarjeta}>
                    <CardHeader className={encabezado}>
                        <CardTitle className="flex items-center gap-2 text-blue-950 dark:text-blue-100">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <Truck className="size-4" />
                            </span>
                            Ventas por proveedor
                        </CardTitle>
                        <CardDescription>
                            Unidades vendidas, costo y ganancia entre dos fechas, agrupadas por proveedor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <form onSubmit={filtrar} className="flex flex-wrap items-end gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="desde" className="text-blue-900 dark:text-blue-200">
                                    Desde
                                </Label>
                                <Input
                                    id="desde"
                                    type="date"
                                    className={inputAzul}
                                    value={rango.desde}
                                    max={rango.hasta}
                                    onChange={(e) => setRango({ ...rango, desde: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="hasta" className="text-blue-900 dark:text-blue-200">
                                    Hasta
                                </Label>
                                <Input
                                    id="hasta"
                                    type="date"
                                    className={inputAzul}
                                    value={rango.hasta}
                                    min={rango.desde}
                                    onChange={(e) => setRango({ ...rango, hasta: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className={botonPrimario}>
                                <Search /> Ver
                            </Button>
                            <Button asChild variant="outline" className={botonContorno}>
                                <a href={`${BASE}/exportar?${params}`}>
                                    <Download /> Exportar Excel
                                </a>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Totales */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className={tarjeta}>
                        <CardHeader className="pb-2">
                            <CardDescription>Unidades vendidas</CardDescription>
                            <CardTitle className="text-2xl text-blue-950 tabular-nums dark:text-white">
                                {totales.unidades}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-blue-600 bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-md dark:border-blue-700">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-blue-100">Vendido</CardDescription>
                            <CardTitle className="text-2xl tabular-nums">{peso.format(totales.monto)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className={tarjeta}>
                        <CardHeader className="pb-2">
                            <CardDescription>Costo</CardDescription>
                            <CardTitle className="text-2xl text-blue-950 tabular-nums dark:text-white">
                                {peso.format(totales.costo)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className={tarjeta}>
                        <CardHeader className="pb-2">
                            <CardDescription>Ganancia</CardDescription>
                            <CardTitle className={`text-2xl tabular-nums ${colorGanancia(totales.ganancia)}`}>
                                {peso.format(totales.ganancia)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            Margen {margen(totales.ganancia, totales.monto)} sobre lo vendido
                        </CardContent>
                    </Card>
                </div>

                {proveedores.length === 0 && (
                    <Card className={`${tarjeta} border-dashed`}>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            <Package className="mx-auto mb-2 size-8 text-blue-300 dark:text-blue-800" />
                            No hay ventas en el período elegido.
                        </CardContent>
                    </Card>
                )}

                {/* Un bloque por proveedor */}
                {proveedores.map((pv) => (
                    <Card key={pv.id} className={`${tarjeta} overflow-hidden`}>
                        <CardHeader className={encabezado}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="flex items-center gap-2 text-blue-950 dark:text-blue-100">
                                    <Package className="size-4 text-blue-600 dark:text-blue-400" />
                                    {pv.nombre}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-3 text-sm tabular-nums">
                                    <Badge className="bg-blue-600 text-white hover:bg-blue-600">{pv.unidades} u.</Badge>
                                    <span className="text-muted-foreground">Vendido {peso.format(pv.monto)}</span>
                                    <span className="text-muted-foreground">Costo {peso.format(pv.costo)}</span>
                                    <span className={`font-semibold ${colorGanancia(pv.ganancia)}`}>
                                        Ganancia {peso.format(pv.ganancia)}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-600 hover:bg-blue-600 dark:bg-blue-900/70 dark:hover:bg-blue-900/70">
                                        <TableHead className="rounded-tl-md text-white">Producto</TableHead>
                                        <TableHead className="text-right text-white">Unidades</TableHead>
                                        <TableHead className="text-right text-white">Vendido</TableHead>
                                        <TableHead className="text-right text-white">Costo</TableHead>
                                        <TableHead className="text-right text-white">Ganancia</TableHead>
                                        <TableHead className="rounded-tr-md text-right text-white">Margen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pv.productos.map((p) => (
                                        <TableRow key={p.id} className="hover:bg-blue-50/70 dark:hover:bg-blue-950/40">
                                            <TableCell className="font-medium">{p.nombre}</TableCell>
                                            <TableCell className="text-right tabular-nums">{p.unidades}</TableCell>
                                            <TableCell className="text-right font-semibold text-blue-700 tabular-nums dark:text-blue-300">
                                                {peso.format(p.monto)}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">{peso.format(p.costo)}</TableCell>
                                            <TableCell className={`text-right tabular-nums ${colorGanancia(p.ganancia)}`}>
                                                {peso.format(p.ganancia)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                                {margen(p.ganancia, p.monto)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}