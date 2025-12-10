import { throwError } from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { createPaymentService } from "../payment/payment.service.js";
import { ORDER_MESSAGES } from "./order.message.js";
import Order from "./order.model.js";
import {
  checkAvailableCar,
  checkAvailableRoute,
  checkAvailableSchedule,
  checkAvailableSeat,
} from "./order.util.js";

const populatedOrder = [
  {
    path: "carId",
    select: "-createdAt -updatedAt",
  },
  {
    path: "routeId",
    select: "-createdAt -updatedAt",
  },
  {
    path: "userId",
    select: "userName email phone",
  },
  {
    path: "scheduleId",
    select: "startTime arrivalTime crew",
  },
];

export const getAllOrderService = async (query) => {
  const orders = await queryBuilder(Order, query, { populate: populatedOrder });
  return orders;
};

export const getAllOrderByUserService = async (userId) => {
  const response = await Order.find({ userId: userId })
    .populate({
      path: "carId",
      select: "-createdAt -updatedAt",
    })
    .populate({
      path: "routeId",
      select: "-createdAt -updatedAt",
    })
    .populate({
      path: "userId",
      select: "userName email crew",
    })
    .populate({
      path: "scheduleId",
      select: "startTime arrivalTime phone",
    })
    .lean();
  return response;
};

export const getDetailOrderService = async (id) => {
  const response = await Order.findById(id)
    .populate({
      path: "carId",
      select: "-createdAt -updatedAt",
    })
    .populate({
      path: "routeId",
      select: "-createdAt -updatedAt",
    })
    .populate({
      path: "userId",
      select: "userName email crew",
    })
    .populate({
      path: "scheduleId",
      select: "startTime arrivalTime phone",
    })
    .lean();
  if (!response) {
    throwError(400, ORDER_MESSAGES.ORDER_NOT_FOUND);
  }
  return response;
};

export const createOrderService = async (payload) => {
  const seatIds = payload.seats.map((item) => item.seatId);
  await checkAvailableCar(payload.carId);
  await checkAvailableRoute(payload.routeId);
  await checkAvailableSchedule(payload.scheduleId);
  await checkAvailableSeat(seatIds);
  const createdOrder = await Order.create(payload);
  const paymentData = await createPaymentService(createdOrder._id);
  return {
    order: createdOrder,
    checkoutUrl: paymentData.checkoutUrl,
  };
};

export const updateOrderService = async (id, payload) => {
  const updatedOrder = await Order.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedOrder;
};

export const updateStatusOrderService = async (id, status) => {};
