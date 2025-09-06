"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mercado_pago_controller_1 = require("../controllers/mercado-pago.controller");
const status_controller_1 = require("../controllers/status.controller");
const webhook_controller_1 = require("../controllers/webhook.controller");
const router = express_1.default.Router();
/**
 * @route POST /api/payments/pix
 * @description Cria um pagamento PIX via Mercado Pago
 * @access Public
 * @body {CheckoutRequest} - Dados do checkout
 */
router.post("/payments/pix", mercado_pago_controller_1.createPixPayment);
/**
 * @route GET /api/payments/status/:id
 * @description Obtém status de um pagamento pelo ID
 * @access Public
 * @param {string} id - ID do pagamento no Mercado Pago
 */
router.get("/payments/status/:id", status_controller_1.getPaymentStatus);
/**
 * @route POST /api/payments/mercado-pago/webhook
 * @description Webhook para receber notificações do Mercado Pago
 * @access Public (chamado pelo Mercado Pago)
 * @body {MercadoPagoWebhookPayload} - Payload do webhook
 */
router.post("/payments/mercado-pago/webhook", express_1.default.raw({ type: "application/json" }), // Middleware para raw body
webhook_controller_1.handleMercadoPagoWebhook);
exports.default = router;
