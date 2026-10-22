
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <title>Catálogo de productos</title>

    <style>
        @page {
            margin: 25px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #263238;
        }

        .portada {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #2563eb;
            margin-bottom: 25px;
        }

        .portada h1 {
            color: #1d4ed8;
            font-size: 24px;
            margin-bottom: 8px;
        }

        .proveedor {
            color: #1d4ed8;
            font-size: 17px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 8px;
            margin-top: 20px;
        }

        .productos {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px;
        }

        .producto {
            width: 50%;
            border: 1px solid #e2e8f0;
            padding: 10px;
            vertical-align: top;
        }

        .imagen {
            width: 115px;
            height: 105px;
            text-align: center;
            margin-bottom: 8px;
        }

        .imagen img {
            max-width: 110px;
            max-height: 100px;
        }

        .sin-imagen {
            color: #94a3b8;
            padding-top: 35px;
        }

        .nombre {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .precio {
            font-size: 15px;
            color: #15803d;
            font-weight: bold;
        }

        .vacio {
            color: #64748b;
            font-style: italic;
        }
    </style>
</head>

<body>
    <div class="portada">
        <h1>CATÁLOGO DE PRODUCTOS</h1>
        <p>Lista de precios</p>
        <p>Fecha: {{ now()->format('d/m/Y') }}</p>
    </div>

    @forelse ($proveedores as $nombreProveedor => $productosProveedor)
        <h2 class="proveedor">
            Proveedor: {{ $nombreProveedor }}
        </h2>

        <table class="productos">
            @foreach ($productosProveedor->chunk(2) as $fila)
                <tr>
                    @foreach ($fila as $producto)
                        <td class="producto">
                            <div class="imagen">
                                @if ($producto->imagen_pdf)
                                    <img
                                        src="{{ $producto->imagen_pdf }}"
                                        alt="Imagen del producto"
                                    >
                                @else
                                    <div class="sin-imagen">
                                        Sin imagen
                                    </div>
                                @endif
                            </div>

                            <div class="nombre">
                                {{ $producto->nombre }}
                            </div>

                            <div class="precio">
                                $ {{ number_format($producto->precio, 2, ',', '.') }}
                            </div>
                        </td>
                    @endforeach

                    @if ($fila->count() === 1)
                        <td class="producto"></td>
                    @endif
                </tr>
            @endforeach
        </table>
    @empty
        <p class="vacio">No hay productos activos para mostrar.</p>
    @endforelse
</body>
</html>
