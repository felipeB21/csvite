import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS,
});

const preference = new Preference(client);

export const createOrder = async (req, res) => {
  const { amount } = req.body;

  if (amount < 2000 || amount > 1000000) {
    return res
      .status(400)
      .json({ error: "El monto debe estar entre 2000 ARS y 500000 ARS." });
  }
  try {
    const response = await preference.create({
      body: {
        items: [
          {
            title: "Mi producto",
            quantity: 1,
            unit_price: amount,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved",
      },
    });

    return res.status(200).json(response.init_point);
  } catch (error) {
    console.log(error);
  }
};
