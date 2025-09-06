"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixPayment = createPixPayment;
const mercadopago_1 = require("mercadopago");
/**
 * Configuração do cliente Mercado Pago
 */
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    options: { timeout: 10000 },
});
/**
 * @function createPixPayment
 * @description Cria um pagamento PIX via Mercado Pago
 * @route POST /api/payments/pix
 * @access Public
 */
async function createPixPayment(req, res) {
    try {
        const { items, item, email, userId, total } = req.body;
        // Exemplo: Preparar itens do checkout
        const checkoutItems = items || (item ? [item] : []);
        // Exemplo: Validação dos dados obrigatórios
        if (checkoutItems.length === 0 || !email || !userId || !total) {
            const response = {
                success: false,
                error: "Missing required fields",
                message: "Itens, email, userId e total são obrigatórios",
                required: {
                    items: checkoutItems.length > 0,
                    email: !!email,
                    userId: !!userId,
                    total: !!total,
                },
            };
            res.status(400).json(response);
            return;
        }
        // Exemplo: Validação de produtos e estoque no banco de dados
        /*
        const productIds = checkoutItems.map((item) => item.id);
        const dbProducts = await db.product.findMany({
          where: { id: { in: productIds } },
        });
    
        for (const item of checkoutItems) {
          const dbProduct = dbProducts.find((p) => p.id === item.id);
    
          if (!dbProduct) {
            const response = {
              success: false,
              error: "Product not found",
              message: `Produto ${item.id} não encontrado`,
              productId: item.id
            };
            res.status(404).json(response);
            return;
          }
    
          if (item.price !== dbProduct.price) {
            const response = {
              success: false,
              error: "Price mismatch",
              message: `Preço do produto ${item.id} não corresponde ao valor no sistema`,
              expected: dbProduct.price,
              received: item.price
            };
            res.status(400).json(response);
            return;
          }
    
          if (dbProduct.stock && dbProduct.stock < item.quantity) {
            const response = {
              success: false,
              error: "Insufficient stock",
              message: `Estoque insuficiente para o produto ${dbProduct.title}`,
              available: dbProduct.stock,
              requested: item.quantity
            };
            res.status(400).json(response);
            return;
          }
        }
        */
        // Exemplo: Preparar descrição do pagamento
        const description = checkoutItems.length === 1
            ? checkoutItems[0].name
            : `Compra de ${checkoutItems.length} itens`;
        // Exemplo: Criar pagamento no Mercado Pago
        const payment = new mercadopago_1.Payment(client);
        const paymentResponse = await payment.create({
            body: {
                transaction_amount: total,
                payment_method_id: "pix",
                description: description,
                payer: {
                    email: email,
                },
                notification_url: `${process.env.BASE_URL}/api/payments/mercado-pago/webhook`,
            },
        });
        const paymentId = paymentResponse?.id?.toString() ?? "";
        // Exemplo: Criar registro da compra no banco de dados
        /*
        await db.$transaction(async (tx) => {
          const caller = appRouter.createCaller({
            db: tx,
            user: { id: userId },
          });
    
          for (const item of checkoutItems) {
            await caller.purchase.createPurchase({
              productId: item.id,
              paymentId: paymentId,
              quantity: item.quantity,
              totalPrice: item.price * item.quantity,
            });
          }
        });
        */
        // Exemplo: Resposta de sucesso com dados do PIX
        const successResponse = {
            success: true,
            payment: {
                id: paymentResponse.id,
                status: paymentResponse.status,
                transaction_amount: total,
                description: description,
            },
            pix: {
                qr_code: paymentResponse.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: paymentResponse.point_of_interaction?.transaction_data
                    ?.qr_code_base64,
                ticket_url: paymentResponse.point_of_interaction?.transaction_data?.ticket_url,
                expiration_date: paymentResponse.date_of_expiration,
            },
            message: "Pagamento PIX criado com sucesso",
        };
        res.status(201).json(successResponse);
    }
    catch (error) {
        console.error("Erro na criação do pagamento PIX:", error);
        // Exemplo: Tratamento de erro específico do Mercado Pago
        if (error instanceof Error && error.message.includes("authentication")) {
            const errorResponse = {
                success: false,
                error: "Authentication error",
                message: "Erro de autenticação com Mercado Pago",
            };
            res.status(401).json(errorResponse);
            return;
        }
        // Exemplo: Tratamento de erro genérico
        const errorResponse = {
            success: false,
            error: "Payment processing error",
            message: "Erro no processamento do pagamento",
            details: error instanceof Error ? error.message : "Unknown error",
        };
        res.status(500).json(errorResponse);
    }
}
