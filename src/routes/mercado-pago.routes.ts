import express from "express";
import { createPixPayment } from "../controllers/mercado-pago.controller";
import { getPaymentStatus } from "../controllers/status.controller";
import { handleMercadoPagoWebhook } from "../controllers/webhook.controller";

const router = express.Router();

/**
 * @route POST /api/payments/pix
 * @description Cria um pagamento PIX via Mercado Pago
 * @access Public
 * @body {CheckoutRequest} - Dados do checkout
 */
router.post("/payments/pix", createPixPayment);

/**
 * @route GET /api/payments/status/:id
 * @description Obtém status de um pagamento pelo ID
 * @access Public
 * @param {string} id - ID do pagamento no Mercado Pago
 */
router.get("/payments/status/:id", getPaymentStatus);

/**
 * @route POST /api/payments/mercado-pago/webhook
 * @description Webhook para receber notificações do Mercado Pago
 * @access Public (chamado pelo Mercado Pago)
 * @body {MercadoPagoWebhookPayload} - Payload do webhook
 */
router.post(
  "/payments/mercado-pago/webhook",
  express.raw({ type: "application/json" }), // Middleware para raw body
  handleMercadoPagoWebhook
);

export default router;
