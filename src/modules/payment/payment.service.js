import { PayOS } from "@payos/node";
import { throwError } from "../../common/utils/create-response.js";
import { ORDER_MESSAGES } from "../order/order.message.js";
import Order from "../order/order.model.js";

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export const createPaymentService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throwError(400, ORDER_MESSAGES.ORDER_NOT_FOUND);
  let paymentOrderCode = order.paymentOrderCode;
  if (!paymentOrderCode) {
    paymentOrderCode = Date.now() % 1000000000;
    order.paymentOrderCode = paymentOrderCode;
    await order.save();
  }
  const payload = {
    orderCode: paymentOrderCode,
    amount: order.totalPrice,
    description: `Thanh toán đơn hàng`,
    returnUrl: "http://localhost:8000/api/payment/webhook",
    //return url là sai sẽ phải sửa//////////
    cancelUrl: "http://localhost:8000/api/payment/webhook",
  };
  const response = await payos.paymentRequests.create(payload);
  // const response = await payos.payment.createPaymentLink(payload);

  order.paymentCheckoutUrl = response.checkoutUrl;
  order.paymentTransactionId = response.transactionId;
  await order.save();
  return {
    checkoutUrl: response.checkoutUrl,
    orderId: order._id,
    paymentOrderCode,
  };
};

export const handlePayOSWebHookService = async (orderCode, status) => {
  const order = await Order.findOne({ paymentOrderCode: orderCode });
  if (!order) throwError(400, ORDER_MESSAGES.ORDER_NOT_FOUND);
  if (status === "PAID") {
    order.isPaid = true;
    await order.save();
  }
  if (status === "CANCELLED") {
    await order.deleteOne();
  }
  return order;
};
