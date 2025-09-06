import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import paymentRoutes from "./routes/mercado-pago.routes";

// Configuração de variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Logging middleware para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas principais
app.use("/api", paymentRoutes);

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
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Erro não tratado:", error);

    const errorResponse = {
      success: false,
      error: "Internal server error",
      message: "Ocorreu um erro interno no servidor",
    };

    res.status(500).json(errorResponse);
  }
);

// Inicialização do servidor

// createPixPayment();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(
    `📍 Webhook URL: http://localhost:${PORT}/api/payments/mercado-pago/webhook`
  );
});
