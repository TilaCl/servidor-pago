// server.js
const express = require('express');
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk');

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para parsear JSON

// Configuración de Transbank para Webpay Plus
const webpay = new WebpayPlus.Transaction(new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,       // Código de comercio de integración
  IntegrationApiKeys.WEBPAY,                   // API Key de integración
  Environment.Integration                      // Cambiar a Environment.Production en producción
));

// Endpoint para crear una transacción
app.post('/api/payment/create', async (req, res) => {
  try {
    const { buyOrder, sessionId, amount } = req.body;
    const returnUrl = "https://tu-app-url.com/api/payment/commit"; // Cambia con la URL de retorno para confirmar el pago

    // Crear transacción en Transbank
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
    const token = req.body.token_ws; // Recibe el token de la solicitud

    // Confirmar transacción en Transbank
    const response = await webpay.commit(token);

    if (response.response_code === 0) { // Código 0 indica éxito
      res.json({ success: true, message: 'Pago completado con éxito', details: response });
    } else {
      res.json({ success: false, message: 'Pago rechazado', details: response });
    }
  } catch (error) {
    console.error("Error al confirmar la transacción:", error);
    res.status(500).json({ error: "Error al confirmar la transacción" });
  }
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor de Transbank escuchando en http://localhost:${PORT}`);
});
