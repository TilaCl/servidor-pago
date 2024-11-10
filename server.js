const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para iniciar transacción
app.post("/api/payment/create", async (req, res) => {
  const { buyOrder, sessionId, amount } = req.body;
  try {
    const response = await axios.post(
      "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
      {
        buy_order: buyOrder,
        session_id: sessionId,
        amount: amount,
        return_url: "https://google.com"
      },
      {
        headers: {
          "Tbk-Api-Key-Id": "597055555532",
          "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
          "Content-Type": "application/json"
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
