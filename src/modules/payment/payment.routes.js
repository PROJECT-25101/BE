import { Router } from "express";
import { createPayment, handlePayOSWebHook } from "./payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/create", createPayment);
paymentRouter.post("/webhook", handlePayOSWebHook);

export default paymentRouter;
