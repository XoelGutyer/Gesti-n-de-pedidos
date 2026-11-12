import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, router } from '@inertiajs/react';
import { Download, Package, Search, Truck } from 'lucide-react';
import { useState } from 'react';

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

const colorGanancia = (n: number) => (n < 0 ? 'text-red-600' : 'text-green-600');

export default function VentasProveedores({ desde, hasta, proveedores, totales }: Props) {
    const [rango, setRango] = useState({ desde, hasta });

    const filtrar = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(BASE, rango, { preserveState: true, preserveScroll: true });
    };

    const params = new URLSearchParams(rango).toString();

    return (
        <>
            <Head title="Ventas por proveedor" />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="size-4 text-muted-foreground" />
                            Ventas por proveedor
                        </CardTitle>
                        <CardDescription>
                            Unidades vendidas, costo y ganancia entre dos fechas, agrupadas por proveedor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={filtrar} className="flex flex-wrap items-end gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="desde">Desde</Label>
                                <Input
                                    id="desde"
                                    type="date"
                                    value={rango.desde}
                                    max={rango.hasta}
                                    onChange={(e) => setRango({ ...rango, desde: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="hasta">Hasta</Label>
                                <Input
                                    id="hasta"
                                    type="date"
                                    value={rango.hasta}
                                    min={rango.desde}
                                    onChange={(e) => setRango({ ...rango, hasta: e.target.value })}
                                />
                            </div>
                            <Button type="submit">
                                <Search /> Ver
                            </Button>
                            <Button asChild variant="outline">
                                <a href={`${BASE}/exportar?${params}`}>
                                    <Download /> Exportar CSV
                                </a>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Unidades vendidas</CardDescription>
                            <CardTitle className="text-2xl tabular-nums">{totales.unidades}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Vendido</CardDescription>
                            <CardTitle className="text-2xl tabular-nums">{peso.format(totales.monto)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Costo</CardDescription>
                            <CardTitle className="text-2xl tabular-nums">{peso.format(totales.costo)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
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
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No hay ventas en el período elegido.
                        </CardContent>
                    </Card>
                )}

                {proveedores.map((pv) => (
                    <Card key={pv.id}>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="size-4 text-muted-foreground" />
                                    {pv.nombre}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-3 text-sm tabular-nums">
                                    <Badge variant="secondary">{pv.unidades} u.</Badge>
                                    <span className="text-muted-foreground">Vendido {peso.format(pv.monto)}</span>
                                    <span className="text-muted-foreground">Costo {peso.format(pv.costo)}</span>
                                    <span className={`font-medium ${colorGanancia(pv.ganancia)}`}>
                                        Ganancia {peso.format(pv.ganancia)}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-right">Unidades</TableHead>
                                        <TableHead className="text-right">Vendido</TableHead>
                                        <TableHead className="text-right">Costo</TableHead>
                                        <TableHead className="text-right">Ganancia</TableHead>
                                        <TableHead className="text-right">Margen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pv.productos.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.nombre}</TableCell>
                                            <TableCell className="text-right tabular-nums">{p.unidades}</TableCell>
                                            <TableCell className="text-right tabular-nums">{peso.format(p.monto)}</TableCell>
                                            <TableCell className="text-right tabular-nums">{peso.format(p.costo)}</TableCell>
                                            <TableCell className={`text-right tabular-nums ${colorGanancia(p.ganancia)}`}>
                                                {peso.format(p.ganancia)}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums text-muted-foreground">
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