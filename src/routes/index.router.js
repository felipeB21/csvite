import { Router } from "express";
const router = Router();

import {
  index,
  profile,
  skins,
  updateTradeUrl,
} from "../controller/index.controller.js";
import { checkAuthentication } from "../middleware/auth.js";

router.get("/", index);
router.get("/skins", skins);
router.get("/profile", checkAuthentication, profile);
router.post("/profile", checkAuthentication, updateTradeUrl);

export default router;
