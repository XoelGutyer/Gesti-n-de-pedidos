<?php

namespace App\Services;

use App\Models\Pedido;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

class MercadoPagoService
{
    /** Devuelve el init_point. Lanza MPApiException si falla. */
    public function crearPreferencia(Pedido $pedido, array $backUrls): string
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.token'));

        $preference = (new PreferenceClient())->create([
            'items' => [[
                'id'          => (string) $pedido->id,
                'title'       => 'Pedido #' . $pedido->id,
                'quantity'    => 1,
                'unit_price'  => round((float) $pedido->total, 2),
                'currency_id' => 'ARS',
            ]],
            'external_reference' => (string) $pedido->id,
            'back_urls'          => $backUrls,
            'auto_return'        => 'approved',
            'notification_url'   => config('services.mercadopago.webhook_url'),
        ]);

        return $preference->init_point;
    }
}