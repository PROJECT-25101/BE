import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { PAYMENT_MESSAGES } from "./payment.message.js";
import {
  createPaymentService,
  handlePayOSWebHookService,
} from "./payment.service.js";

export const handlePayOSWebHook = handleAsync(async (req, res) => {
  const { orderCode, status } = req.query;
  const updatedOrder = await handlePayOSWebHookService(orderCode, status);
  return updatedOrder
    ? res.redirect("http://localhost:5173/payment/success")
    : res.redirect("http://localhost:5173/payment/failed");
});
