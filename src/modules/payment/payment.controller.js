import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { PAYMENT_MESSAGES } from "./payment.message.js";
import {
  createPaymentService,
  handlePayOSWebHookService,
} from "./payment.service.js";

export const createPayment = handleAsync(async (req, res) => {
  const { orderId } = req.body;
  const data = await createPaymentService(orderId);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data);
});

export const handlePayOSWebHook = handleAsync(async (req, res) => {
  const { orderCode, status } = req.query;
  const updatedOrder = await handlePayOSWebHookService(orderCode, status);
  return createResponse(
    res,
    200,
    PAYMENT_MESSAGES.WEBHOOK_PROCESSED,
    updatedOrder,
  );
});
