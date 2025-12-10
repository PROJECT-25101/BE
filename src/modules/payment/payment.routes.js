import { Router } from "express";
import { handlePayOSWebHook } from "./payment.controller.js";

const paymentRouter = Router();

paymentRouter.get("/webhook", handlePayOSWebHook);

export default paymentRouter;
