
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acceso denegado</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: Arial, sans-serif;
            background: #f9fafb;
            color: #111827;
        }

        .container {
            max-width: 480px;
            text-align: center;
        }

        .code {
            margin: 0;
            color: #dc2626;
            font-size: 96px;
            font-weight: 800;
        }

        h1 {
            font-size: 28px;
        }

        p {
            color: #6b7280;
            line-height: 1.7;
        }

        a {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            border-radius: 10px;
            background: #2563eb;
            color: white;
            text-decoration: none;
        }

        a:hover {
            background: #1d4ed8;
        }
    </style>
</head>
<body>
    <main class="container">
        <p class="code">403</p>

        <h1>Acceso denegado</h1>

        <p>
            No tenés permisos para acceder a esta sección.
            Si creés que es un error, contactá al administrador.
        </p>

        <a href="/">Volver al inicio</a>
    </main>
</body>
</html>
