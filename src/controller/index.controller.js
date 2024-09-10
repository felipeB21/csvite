import steaminventory from "get-steam-inventory";
import User from "../models/User.js";
const links = [
  { href: "/skins", text: "Skins" },
  { href: "/sell", text: "Vender" },
  { href: "/contact", text: "Contacto" },
  { href: "/support", text: "Soporte" },
];

export const index = (req, res) => {
  const user = req.user;
  const currentPath = req.path;
  res.render("pages/index", { user, links, currentPath });
};

export const profile = async (req, res) => {
  const user = req.user;
  const currentPath = req.path;
  const successMsg = req.session.successMsg;
  const errorMsg = req.session.errorMsg;

  req.session.successMsg = null;
  req.session.errorMsg = null;

  try {
    const steamid = user.steamId;
    const inventory = await steaminventory.getinventory(730, steamid, "2");
    const data = inventory.items;

    const extractTextInsideParentheses = (text) => {
      const match = text.match(/\(([^)]+)\)/);
      return match ? match[1] : "No info";
    };

    const inv = data
      .filter((item) => item.marketable !== 0)
      .map((item) => ({
        state: extractTextInsideParentheses(item.market_name),
        name: item.market_name,
        icon_url: `https://cdn.skinsmonkey.com/economy/image/${item.icon_url}`,
      }));

    res.render("pages/profile", {
      user,
      successMsg,
      errorMsg,
      links,
      currentPath,
      inv,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.render("pages/profile", {
      user,
      successMsg,
      errorMsg,
      links,
      currentPath,
      inv: [],
    });
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
  const currentPath = req.path;

  res.render("pages/skins", { user, links, currentPath });
};

export const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
