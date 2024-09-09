import { Router } from "express";
import { createOrder } from "../controller/payments.controller.js";
const router = Router();

router.post("/create-order", createOrder);
router.get("/success");
router.get("/webhook");

export default router;
