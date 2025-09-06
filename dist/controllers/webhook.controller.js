"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMercadoPagoWebhook = handleMercadoPagoWebhook;
const mercadopago_1 = require("mercadopago");
// Importe suas dependências conforme necessário
// import { db } from '../config/database';
// import { transporter } from '../config/email';
// import { generatePurchaseConfirmationEmail } from '../utils/emailTemplates';
/**
 * Configuração do cliente Mercado Pago
 */
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});
/**
 * @function handleMercadoPagoWebhook
 * @description Processa webhooks do Mercado Pago para atualizar status de pagamentos
 * @route POST /api/webhooks/mercado-pago
 * @access Public (chamado pelo Mercado Pago)
 */
async function handleMercadoPagoWebhook(req, res) {
    try {
        const { body } = req;
        // Exemplo: Validação do payload do webhook
        if (!body || !body.data || !body.data.id) {
            const response = {
                success: false,
                error: "Invalid webhook payload",
                message: "Payload deve conter data.id",
            };
            res.status(400).json(response);
            return;
        }
        const paymentId = body.data.id;
        // Exemplo: Buscar informações do pagamento no Mercado Pago
        const payment = new mercadopago_1.Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });
        // Exemplo: Buscar compra no banco de dados
        /*
        const purchase = await db.purchase.findFirst({
          where: { paymentId: paymentId.toString() },
          include: {
            user: true,
            product: true,
          },
        });
    
        if (!purchase) {
          const response = {
            success: false,
            error: "Purchase not found",
            paymentId: paymentId
          };
          res.status(404).json(response);
          return;
        }
        */
        // Exemplo: Atualizar status da compra
        /*
        const updatedPurchase = await db.purchase.update({
          where: { id: purchase.id },
          data: {
            status: paymentInfo.status === "approved" ? "COMPLETED" : "PENDING",
            updatedAt: new Date(),
          },
          include: {
            product: true,
            user: true,
          },
        });
        */
        // Exemplo: Enviar email de confirmação para pagamentos aprovados
        if (paymentInfo.status === "approved") {
            /*
            const emailOptions = generatePurchaseConfirmationEmail({
              email: updatedPurchase.user.email,
              name: updatedPurchase.user.name || "Cliente",
              orderId: updatedPurchase.id,
              purchaseDate: updatedPurchase.createdAt.toLocaleDateString("pt-BR"),
              items: [
                {
                  name: updatedPurchase.product.title,
                  quantity: updatedPurchase.quantity || 1,
                  price: updatedPurchase.product.price,
                },
              ],
              totalAmount: updatedPurchase.total,
            });
      
            try {
              await transporter.sendMail(emailOptions);
              console.log("Email de confirmação enviado com sucesso");
            } catch (emailError) {
              console.error("Erro ao enviar email de confirmação:", emailError);
            }
            */
        }
        // Exemplo: Resposta de sucesso
        const successResponse = {
            success: true,
            message: "Webhook processado com sucesso",
            paymentId: paymentId,
            status: paymentInfo.status,
        };
        res.status(200).json(successResponse);
    }
    catch (error) {
        console.error("Erro no webhook:", error);
        // Exemplo: Tratamento de erro genérico
        const errorResponse = {
            success: false,
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Erro desconhecido",
        };
        res.status(500).json(errorResponse);
    }
}
