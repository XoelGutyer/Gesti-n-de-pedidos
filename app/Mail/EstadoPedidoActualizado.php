<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EstadoPedidoActualizado extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(protected array $data)
    {
        //
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Actualización de tu pedido #{$this->data['pedido_id']}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.pedidos.estado_actualizado',
            with: ['data' => $this->data],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}