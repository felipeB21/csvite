import { Router } from "express";
import {
  createOrder,
  handleSuccess,
} from "../controller/payments.controller.js";
import { checkAuthentication } from "../middleware/auth.js";
const router = Router();

router.post("/create-order", checkAuthentication, createOrder);
router.get("/success", handleSuccess);
router.get("/failure", (req, res) => res.send("Pago fallido"));
router.get("/pending", (req, res) => res.send("Pago pendiente"));

export default router;
