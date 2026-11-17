@extends('emails.layout')

@section('titulo', 'Actualización de tu pedido')

@section('content')
    <p style="margin-top: 0; margin-bottom: 20px; font-size: 17px; color: #111827;">
        Hola <strong>{{ $data['cliente'] }}</strong>,
    </p>

    <p style="margin-top: 0; margin-bottom: 24px; color: #4b5563;">
        {{ $data['mensaje'] }}
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color: #f8fafc; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
        <tr>
            <td style="padding: 16px 20px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: 600;">Pedido</p>
                <p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 500;">#{{ $data['pedido_id'] }}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 0 20px 16px 20px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: 600;">Estado</p>
                <p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 500;">{{ $data['estado'] }}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 0 20px 16px 20px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: 600;">Dirección de entrega</p>
                <p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 500;">{{ $data['direccion'] }}</p>
            </td>
        </tr>
    </table>
@endsection