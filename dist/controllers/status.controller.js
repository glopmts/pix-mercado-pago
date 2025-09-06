"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentStatus = getPaymentStatus;
const mercadopago_1 = require("mercadopago");
// Importe suas dependências conforme necessário
// import { db } from '../config/database';
/**
 * Configuração do cliente Mercado Pago
 */
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    options: { timeout: 10000 },
});
/**
 * @function getPaymentStatus
 * @description Obtém o status de um pagamento no Mercado Pago
 * @route GET /api/payments/status/:id
 * @access Public
 */
async function getPaymentStatus(req, res) {
    try {
        const { id: paymentId } = req.params;
        // Exemplo: Validação do ID do pagamento
        if (!paymentId) {
            const response = {
                success: false,
                error: "Missing payment ID",
                message: "ID do pagamento é obrigatório",
            };
            res.status(400).json(response);
            return;
        }
        // Exemplo: Buscar informações do pagamento no Mercado Pago
        const payment = new mercadopago_1.Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });
        // Exemplo: Atualizar status da compra no banco de dados
        /*
        const updatedPurchase = await db.purchase.updateMany({
          where: {
            paymentId: paymentId.toString()
          },
          data: {
            status: paymentInfo.status === "approved" ? "COMPLETED" : "PENDING",
            updatedAt: new Date(),
          },
        });
    
        if (updatedPurchase.count === 0) {
          const response = {
            success: false,
            error: "No purchase found with this payment ID",
            paymentId: paymentId
          };
          res.status(404).json(response);
          return;
        }
        */
        // Exemplo: Resposta de sucesso com dados do pagamento
        const successResponse = {
            success: true,
            payment: {
                id: paymentInfo.id,
                status: paymentInfo.status,
                status_detail: paymentInfo.status_detail,
                transaction_amount: paymentInfo.transaction_amount,
                date_approved: paymentInfo.date_approved,
                currency_id: paymentInfo.currency_id,
            },
            message: "Status do pagamento obtido com sucesso",
        };
        res.status(200).json(successResponse);
    }
    catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
        // Exemplo: Tratamento de erro específico para timeout
        if (error instanceof Error && error.message.includes("timeout")) {
            const errorResponse = {
                success: false,
                error: "Timeout checking payment status",
                message: "Tempo excedido ao consultar o status do pagamento",
            };
            res.status(504).json(errorResponse);
            return;
        }
        // Exemplo: Tratamento de erro genérico
        const errorResponse = {
            success: false,
            error: "Failed to check payment status",
            details: error instanceof Error ? error.message : "Unknown error",
            message: "Erro ao verificar status do pagamento",
        };
        res.status(500).json(errorResponse);
    }
}
