"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mercado_pago_routes_1 = __importDefault(require("./routes/mercado-pago.routes"));
// Configuração de variáveis de ambiente
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middlewares globais
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logging middleware para debug
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Rotas principais
app.use("/api", mercado_pago_routes_1.default);
// Health check endpoint
app.get("/health", (req, res) => {
    const healthResponse = {
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Mercado Pago API Service",
        endpoints: {
            createPix: "POST /api/payments/pix",
            getStatus: "GET /api/payments/status/:id",
            webhook: "POST /api/payments/mercado-pago/webhook",
        },
    };
    res.status(200).json(healthResponse);
});
// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
    console.error("Erro não tratado:", error);
    const errorResponse = {
        success: false,
        error: "Internal server error",
        message: "Ocorreu um erro interno no servidor",
    };
    res.status(500).json(errorResponse);
});
// Inicialização do servidor
// createPixPayment();
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📍 Webhook URL: http://localhost:${PORT}/api/payments/mercado-pago/webhook`);
});
