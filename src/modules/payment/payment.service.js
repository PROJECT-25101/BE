import Order from "../order/order.model.js";
import { throwError } from "../../common/utils/create-response.js";
import { ORDER_MESSAGES } from "../order/order.message.js";
import { PayOS } from "@payos/node";

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
    returnUrl: "http://localhost:5173/",
    //return url là sai sẽ phải sửa//////////
    cancelUrl: "http://localhost:5173/",
  };
  console.log(payload);
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
  switch (status) {
    case "PAID":
      order.paymentStatus = "paid";
      order.status = "paid";
      break;

    case "FAILED":
      order.paymentStatus = "failed";
      break;

    case "CANCELLED":
      order.paymentStatus = "failed";
      order.status = "canceled";
      break;
  }
  if (order.paymentHistory) {
    order.paymentHistory.push({
      at: new Date(),
      status,
      orderCode: orderCode,
    });
  }

  await order.save();

  return order;
};
