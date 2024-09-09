import { Router } from "express";
const router = Router();

import {
  index,
  profile,
  skins,
  updateEmail,
  updateTradeUrl,
} from "../controller/index.controller.js";
import { checkAuthentication } from "../middleware/auth.js";

router.get("/", index);
router.get("/skins", skins);
router.get("/profile", checkAuthentication, profile);
router.post("/profile/update-trade-url", checkAuthentication, updateTradeUrl);
router.post("/profile/update-email", checkAuthentication, updateEmail);

export default router;
