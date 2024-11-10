const express = require('express');
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk');

const app = express();
app.use(express.json());

// Configuración de Transbank para Webpay Plus en ambiente de integración
const webpay = new WebpayPlus.Transaction(new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  Environment.Integration
));

// Endpoint para crear una transacción
app.post('/api/payment/create', async (req, res) => {
  try {
    const { buyOrder, sessionId, amount } = req.body;
    const returnUrl = "https://servidor-pago-gchg.vercel.app/api/payment/commit"; // Cambia esta URL a la de tu proyecto en Vercel

    const response = await webpay.create(buyOrder, sessionId, amount, returnUrl);
    res.status(200).json({ token: response.token, url: response.url });
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    res.status(500).json({ error: "Error al crear la transacción" });
  }
});

// Endpoint para confirmar la transacción
app.post('/api/payment/commit', async (req, res) => {
  try {
    const token = req.body.token_ws;

    const response = await webpay.commit(token);
    if (response.response_code === 0) {
      res.json({ success: true, message: 'Pago completado con éxito', details: response });
    } else {
      res.json({ success: false, message: 'Pago rechazado', details: response });
    }
  } catch (error) {
    console.error("Error al confirmar la transacción:", error);
    res.status(500).json({ error: "Error al confirmar la transacción" });
  }
});

// Exporta `app` para que Vercel lo utilice sin necesidad de `app.listen`
module.exports = app;
