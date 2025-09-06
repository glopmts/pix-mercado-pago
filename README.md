# 🚀 API Mercado Pago PIX - Documentação Completa

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Instalação](#-instalação)
3. [Configuração](#-configuração)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Endpoints da API](#-endpoints-da-api)
6. [Exemplos de Uso](#-exemplos-de-uso)
7. [Tratamento de Erros](#-tratamento-de-erros)
8. [Fluxo de Pagamento](#-fluxo-de-pagamento)
9. [Deploy](#-deploy)
10. [Monitoramento](#-monitoramento)

## 🎯 Visão Geral

API completa para integração com Mercado Pago PIX utilizando Node.js e TypeScript. Inclui criação de pagamentos, verificação de status e webhooks.

## 📦 Instalação

### Pré-requisitos

```bash
Node.js 16+
npm ou yarn

Comandos de Instalação
# Clone o projeto
git clone <seu-repositorio>
cd pix-mercado-pago

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env

⚙️ Configuração
Variáveis de Ambiente (.env)

# exemplos de envs
# você pode pegalas em https://www.mercadopago.com.br/developers/pt/reference em minhas apliacações

MERCADO_PAGO_ACCESS_TOKEN=""
MERCADO_PAGO_PUBLIC_KEY=""
MERCADO_PAGO_WEBHOOK_SECRET=""

# Observação: necessario uma URL valida, exe: https://meusite.com
# urls como http://locallhost:3003 não funciona a validação hook
BASE_URL="https://meusite.com"


📁 Estrutura do Projeto

src/
├── controllers/
│   ├── mercado-pago.controller.ts    # Criação de pagamentos
│   ├── status.controller.ts   # Verificação de status
│   └── webhook.controller.ts    # Processamento de webhooks
├── routes/
│   └── mercado-pago.routes.ts     # Definição de rotas
├── config/
│   ├── database.ts             # Configuração do DB
│   └── email.ts               # Configuração de email
├── types/
│   └── index.ts               # Tipos TypeScript
└── index.ts                   # Ponto de entrada


📡 Endpoints da API
1. Health Check
GET /health

bash
curl -X GET http://localhost:5001/health
Response:

json
{
  "status": "OK",
  "timestamp": "2023-12-01T12:00:00.000Z",
  "service": "Mercado Pago API Service"
}
2. Criar Pagamento PIX
POST /api/payments/pix

Request:

bash
curl -X POST http://localhost:5001/api/payments/pix \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": "prod_123",
        "name": "Produto Exemplo",
        "price": 100.00,
        "quantity": 2
      }
    ],
    "email": "cliente@email.com",
    "userId": "user_123",
    "total": 200.00
  }'
Response (201 Created):

json
{
  "success": true,
  "payment": {
    "id": "1234567890",
    "status": "pending",
    "transaction_amount": 200.00,
    "description": "Produto Exemplo"
  },
  "pix": {
    "qr_code": "00020126600014br.gov.bcb.pix...",
    "qr_code_base64": "data:image/png;base64,iVBORw0KGgo...",
    "ticket_url": "https://www.mercadopago.com.br/payments/1234567890/ticket",
    "expiration_date": "2023-12-01T23:59:59.000Z"
  },
  "message": "Pagamento PIX criado com sucesso"
}
3. Verificar Status do Pagamento
GET /api/payments/status/:id

Request:

bash
curl -X GET http://localhost:5001/api/payments/status/1234567890
Response (200 OK):

json
{
  "success": true,
  "payment": {
    "id": "1234567890",
    "status": "approved",
    "status_detail": "accredited",
    "transaction_amount": 200.00,
    "date_approved": "2023-12-01T12:00:00.000Z",
    "currency_id": "BRL"
  },
  "message": "Status do pagamento obtido com sucesso"
}
4. Webhook do Mercado Pago
POST /api/payments/mercado-pago/webhook

Payload (Mercado Pago):

json
{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "1234567890"
  },
  "date_created": "2023-12-01T12:00:00Z",
  "id": 123456,
  "live_mode": true,
  "type": "payment"
}
Response (200 OK):

json
{
  "success": true,
  "message": "Webhook processado com sucesso",
  "paymentId": "1234567890",
  "status": "approved"
}
💻 Exemplos de Uso
Exemplo Frontend (React/Next.js)
typescript
// Criar pagamento PIX
const createPixPayment = async (items: any[], total: number, user: any) => {
  try {
    const response = await fetch('/api/payments/pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        email: user.email,
        userId: user.id,
        total
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Exibir QR Code para o usuário
      console.log('QR Code:', data.pix.qr_code);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
};

// Verificar status do pagamento
const checkPaymentStatus = async (paymentId: string) => {
  try {
    const response = await fetch(`/api/payments/status/${paymentId}`);
    const data = await response.json();

    if (data.success) {
      return data.payment;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    throw error;
  }
};
Exemplo Backend (Controller)
typescript
// paymentController.ts - Exemplo simplificado
export async function createPixPayment(req: Request, res: Response) {
  try {
    const { items, email, userId, total } = req.body;

    // Validações
    if (!items || !email || !userId || !total) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios faltando"
      });
    }

    // Criar pagamento no Mercado Pago
    const payment = new Payment(client);
    const response = await payment.create({
      body: {
        transaction_amount: total,
        payment_method_id: "pix",
        description: "Compra via PIX",
        payer: { email },
        notification_url: `${process.env.BASE_URL}/api/payments/mercado-pago/webhook`
      }
    });

    // Resposta de sucesso
    res.status(201).json({
      success: true,
      payment: {
        id: response.id,
        status: response.status,
        transaction_amount: total
      },
      pix: {
        qr_code: response.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro no processamento do pagamento"
    });
  }
}
🚨 Tratamento de Erros
Exemplos de Respostas de Erro
400 - Bad Request:

json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Itens, email, userId e total são obrigatórios",
  "required": {
    "items": false,
    "email": true,
    "userId": true,
    "total": true
  }
}
404 - Not Found:

json
{
  "success": false,
  "error": "Payment not found",
  "message": "Nenhum pagamento encontrado com o ID fornecido",
  "paymentId": "1234567890"
}
500 - Internal Server Error:

json
{
  "success": false,
  "error": "Internal server error",
  "message": "Erro no processamento do pagamento",
  "details": "Timeout ao conectar com Mercado Pago"
}
🔄 Fluxo de Pagamento Completo
Frontend → Cria pagamento via POST /api/payments/pix

API → Gera QR Code PIX no Mercado Pago

API → Retorna dados do PIX para frontend

Usuário → Escaneia QR Code e realiza pagamento

Mercado Pago → Envia notificação via webhook

API → Processa webhook e atualiza status

API → Envia email de confirmação (opcional)

Frontend → Verifica status via GET /api/payments/status/:id

🚀 Deploy
Comandos de Build
bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start

# Com variáveis de ambiente
MERCADO_PAGO_ACCESS_TOKEN=token BASE_URL=url npm start
Variáveis de Produção
env
MERCADO_PAGO_ACCESS_TOKEN=prod_xxxx
BASE_URL=https://seusite.com
PORT=5001
NODE_ENV=production
Deploy na Vercel
json
// vercel.json
{
  "version": 2,
  "builds": [{ "src": "dist/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "dist/index.js" }],
  "env": {
    "MERCADO_PAGO_ACCESS_TOKEN": "@mercado_pago_access_token",
    "BASE_URL": "https://seusite.com"
  }
}
📊 Monitoramento
Health Check
bash
curl https://seusite.com/health
Logs de Exemplo
bash
# Log de sucesso
[INFO] 2023-12-01T12:00:00.000Z - POST /api/payments/pix - 201
[INFO] Pagamento PIX criado: 1234567890

# Log de erro
[ERROR] 2023-12-01T12:00:00.000Z - GET /api/payments/status/invalid_id - 404
[ERROR] Pagamento não encontrado: invalid_id
🛡️ Segurança
Boas Práticas
Valide sempre os dados de entrada

Use HTTPS em produção

Configure CORS adequadamente

Valide assinaturas de webhook

Gerencie corretamente as chaves de API

Validação de Webhook
typescript
function validateWebhookSignature(signature: string, payload: any): boolean {
  // Implemente a validação conforme documentação do Mercado Pago
  return signature.startsWith('sha1=');
}
📞 Suporte
Solução de Problemas Comuns
Erro de Autenticação

bash
# Verifique o access token
echo $MERCADO_PAGO_ACCESS_TOKEN
Webhook Não Funcionando

bash
# Verifique a URL configurada
curl -X POST https://seusite.com/api/payments/mercado-pago/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "payload"}'
Timeout nas Requisições

typescript
// Aumente o timeout se necessário
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  options: { timeout: 15000 }
});
Recursos Úteis
Documentação Mercado Pago

Dashboard Mercado Pago

Webhook Tester

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

Nota: Esta documentação assume que você já configurou corretamente as credenciais do Mercado Pago e possui uma conta ativa.

Para dúvidas ou problemas, consulte a documentação oficial do Mercado Pago ou abra uma issue no repositório do projeto.
```
