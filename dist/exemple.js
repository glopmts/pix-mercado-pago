"use strict";
// Exemplo: Criar pagamento PIX
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentStatus = exports.createPixPayment = void 0;
const url = "http://locallhost:5001";
const createPixPayment = async () => {
    try {
        const response = await fetch("/api/payments/pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: [
                    {
                        id: "prod_123",
                        name: "Produto Exemplo",
                        price: 100.0,
                        quantity: 2,
                    },
                ],
                email: "cliente@email.com",
                userId: "user_123",
                total: 200.0,
            }),
        });
        const data = await response.json();
        if (data.success) {
            console.log("QR Code PIX:", data.pix.qr_code);
            // Exibir QR Code para o usuário
        }
    }
    catch (error) {
        console.error("Erro ao criar pagamento:", error);
    }
};
exports.createPixPayment = createPixPayment;
// Exemplo: Verificar status do pagamento
const checkPaymentStatus = async (paymentId) => {
    try {
        const response = await fetch(`/api/payments/status/${paymentId}`);
        const data = await response.json();
        if (data.success) {
            console.log("Status do pagamento:", data.payment.status);
        }
    }
    catch (error) {
        console.error("Erro ao verificar status:", error);
    }
};
exports.checkPaymentStatus = checkPaymentStatus;
