<?php

namespace App\Http\Controllers\Api;

use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;
use MercadoPago\MercadoPagoConfig;
use App\Http\Controllers\Controller;
use App\Services\MercadoPagoService;

class PagoController extends Controller
{
    public function crear(Request $request, Pedido $pedido, MercadoPagoService $mp)
{
    abort_unless($pedido->usuario_id === $request->user()->id, 403);

    if ($pedido->total <= 0) {
        return response()->json(['message' => 'El pedido no tiene un total válido'], 422);
    }
    if ($pedido->pagado) {
        return response()->json(['message' => 'El pedido ya está pagado'], 422);
    }

    try {
        $url = $mp->crearPreferencia($pedido, [
            'success' => 'miapp://pago/success',
            'failure' => 'miapp://pago/failure',
            'pending' => 'miapp://pago/pending',
        ]);
    } catch (MPApiException $e) {
        Log::error('MP preferencia', ['body' => $e->getApiResponse()->getContent()]);
        return response()->json(['message' => 'No se pudo iniciar el pago'], 502);
    }

    return response()->json(['init_point' => $url]);
}

    public function webhook(Request $request)
    {
        if ($request->input('type') !== 'payment') {
            return response()->json(['ok' => true]);
        }

        MercadoPagoConfig::setAccessToken(config('services.mercadopago.token'));

        try {
            $paymentId = $request->input('data.id');
            $payment   = (new PaymentClient())->get($paymentId);   // se verifica contra la API de MP

            $pedido = Pedido::find($payment->external_reference);

            if ($pedido && !$pedido->pagado && $payment->status === 'approved') {
                $pedido->update([
                    'pagado'        => true,
                    'mp_payment_id' => (string) $paymentId,
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('MP webhook', ['error' => $e->getMessage()]);
            return response()->json(['ok' => false], 500);   // MP reintenta
        }

        return response()->json(['ok' => true]);
    }
}