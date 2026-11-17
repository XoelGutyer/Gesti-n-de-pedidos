<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación del Sistema</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, Helvetica, sans-serif; width: 100% !important;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color: #f4f6f9; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                    style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">

                    <!-- Encabezado -->
                    <tr>
                        <td align="center" bgcolor="#1e3a8a"
                            style="background-color: #1e3a8a; padding: 24px; color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: bold; line-height: 26px;">
                            @yield('titulo', 'Notificación del Sistema')
                        </td>
                    </tr>

                    <!-- Contenido dinámico -->
                    <tr>
                        <td style="padding: 32px; color: #374151; font-size: 16px; line-height: 1.6;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Pie de página -->
                    <tr>
                        <td align="center"
                            style="background-color: #fafafa; padding: 16px 32px; border-top: 1px solid #f3f4f6; color: #9ca3af; font-size: 13px;">
                            Este es un correo automático, por favor no respondas a este mensaje.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>