import crypto from "crypto";
import User from "../models/User.js";
const links = [
  { href: "/skins", text: "Skins" },
  { href: "/sell", text: "Vender" },
  { href: "/contact", text: "Contacto" },
  { href: "/support", text: "Soporte" },
];

export const index = (req, res) => {
  const user = req.user;

  res.render("pages/index", { user, links });
};

export const profile = async (req, res) => {
  const user = req.user;
  const successMsg = req.session.successMsg;
  const errorMsg = req.session.errorMsg;

  req.session.successMsg = null;
  req.session.errorMsg = null;

  try {
    const inventory = await fetch(
      "https://steamcommunity.com/profiles/76561198328808887/inventory/json/730/2",
      {
        headers: {
          "content-type": "application/json",
        },
        method: "GET",
      }
    );
    console.log(inventory);

    const data = await inventory.json();
    console.log("success", data);
    res.render("pages/profile", { user, links, successMsg, errorMsg, data });
  } catch (error) {
    console.log(error);
  }
};

export const updateTradeUrl = async (req, res) => {
  const { tradeurl } = req.body;
  const userId = req.user.id;

  try {
    if (!tradeurl) {
      req.session.errorMsg = "Ingrese su Trade URL";
      return res.redirect("/profile");
    }

    const validTradeUrlPattern = /^https:\/\/steamcommunity\.com\/tradeoffer\//;
    if (!validTradeUrlPattern.test(tradeurl)) {
      req.session.errorMsg =
        "El Trade URL debe comenzar con 'https://steamcommunity.com/tradeoffer/'";
      return res.redirect("/profile");
    }

    const user = await User.findById(userId);

    if (!user) {
      req.session.errorMsg = "Usuario no encontrado";
      return res.redirect("/profile");
    }

    if (tradeurl === user.tradeUrl) {
      req.session.successMsg = "El Trade URL ya está actualizado";
      return res.redirect("/profile");
    }

    user.tradeUrl = tradeurl;
    await user.save();

    req.session.successMsg = "Trade URL actualizado correctamente";
    return res.redirect("/profile");
  } catch (error) {
    console.error("Error updating trade URL:", error);
    req.session.errorMsg = "Error en el servidor";
    return res.redirect("/profile");
  }
};

export const updateEmail = async (req, res) => {
  const { email } = req.body;
  const userId = req.user.id;
  try {
    if (!email) {
      req.session.errorMsg = "Ingrese un email";
      return res.redirect("/profile");
    }

    const user = await User.findById(userId);

    if (!user) {
      req.session.errorMsg = "Usuario no encontrado";
      return res.redirect("/profile");
    }

    if (email === user.email) {
      req.session.successMsg = "El email ya está actualizado";
      return res.redirect("/profile");
    }

    user.email = email;
    await user.save();

    req.session.successMsg = "Email actualizado correctamente";
    return res.redirect("/profile");
  } catch (error) {
    console.error("Error updating trade URL:", error);
    req.session.errorMsg = "Error en el servidor";
    return res.redirect("/profile");
  }
};

export const skins = async (req, res) => {
  const user = req.user;
  res.render("pages/skins", { user, links });
};
