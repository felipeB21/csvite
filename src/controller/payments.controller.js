import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS,
});

const preference = new Preference(client);

export const createOrder = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!userId) return res.status(400).json({ error: "Usuario no encontrado." });

  if (amount < 2000 || amount > 2000000) {
    return res.status(400).json({
      error: "El monto debe estar entre 2.000,00 ARS y 2.000.000,00 ARS.",
    });
  }
  try {
    const response = await preference.create({
      body: {
        items: [
          {
            title: "Ingresar Dinero en CSVITE",
            quantity: 1,
            unit_price: amount,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `http://localhost:3000/payments/success?userId=${userId}&amount=${amount}`,
          failure: "http://localhost:3000/profile",
          pending: "http://localhost:3000/payments/pending",
        },
        auto_return: "approved",
      },
    });

    return res.status(200).json(response.init_point);
  } catch (error) {
    console.error("Error creando la preferencia:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const handleSuccess = async (req, res) => {
  const { userId, amount } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    user.money += parseFloat(amount);
    await user.save();

    return res.redirect("/profile");
  } catch (error) {
    console.error("Error al actualizar el saldo:", error);
    return res.status(500).json({ error: "Error al actualizar el saldo." });
  }
};

export const getOrders = async (req, res) => {
  try {
  } catch (error) {}
};

export const withrawBalance = async (req, res) => {};
