<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Remitos</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 13px; color: #111; margin: 0; }
        .remito { padding: 24px 32px; page-break-after: always; }
        .remito:last-of-type { page-break-after: auto; }
        h1 { font-size: 20px; margin: 0 0 4px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border-bottom: 1px solid #ccc; padding: 6px 4px; text-align: left; }
        .num { text-align: right; }
        .total { text-align: right; font-size: 16px; font-weight: bold; margin-top: 12px; }
        .firma { margin-top: 60px; display: flex; justify-content: space-between; }
        .firma div { width: 40%; border-top: 1px solid #111; text-align: center; padding-top: 4px; }
        .barra { padding: 12px; background: #f3f4f6; text-align: center; }
        @media print { .barra { display: none; } }
    </style>
</head>
<body>
    <div class="barra">
        <button onclick="window.print()">Imprimir / Guardar como PDF</button>
        ({{ $pedidos->count() }} remito(s))
    </div>

    @foreach ($pedidos as $pedido)
        <section class="remito">
            <div class="meta">
                <div>
                    <h1>Remito N.º {{ str_pad($pedido->id, 6, '0', STR_PAD_LEFT) }}</h1>
                    <div>Fecha: {{ $pedido->fecha->format('d/m/Y') }}</div>
                </div>
                <div style="text-align:right">
                    <strong>{{ config('app.name') }}</strong>
                    <div>Documento no válido como factura</div>
                </div>
            </div>

            <div><strong>Cliente:</strong> {{ $pedido->cliente }}</div>
            <div><strong>Dirección:</strong> {{ $pedido->direccion }}</div>
            @if ($pedido->nota)
                <div><strong>Nota:</strong> {{ $pedido->nota }}</div>
            @endif
            <div><strong>Pago:</strong> {{ $pedido->pagado ? 'Pagado' : 'Pendiente' }}</div>

            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th class="num">Cant.</th>
                        <th class="num">Precio unit.</th>
                        <th class="num">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($pedido->items as $item)
                        <tr>
                            <td>{{ $item->producto->nombre }}</td>
                            <td class="num">{{ $item->cantidad }}</td>
                            <td class="num">$ {{ number_format($item->cantidad ? $item->subtotal / $item->cantidad : 0, 2, ',', '.') }}</td>
                            <td class="num">$ {{ number_format($item->subtotal, 2, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="total">Total: $ {{ number_format($pedido->total, 2, ',', '.') }}</div>

            <div class="firma">
                <div>Firma de quien entrega</div>
                <div>Firma y aclaración de quien recibe</div>
            </div>
        </section>
    @endforeach
</body>
</html>