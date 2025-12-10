import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { ORDER_MESSAGES } from "./order.message.js";
import {
  createOrderService,
  getAllOrderByUserService,
  getAllOrderService,
  getDetailOrderService,
  updateOrderService,
} from "./order.service.js";

export const getAllOrder = handleAsync(async (req, res) => {
  const query = req.query;
  const { data, meta } = await getAllOrderService(query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data, meta);
});

export const getAllOrderByUser = handleAsync(async (req, res) => {
  const { userId } = req.params;
  const response = await getAllOrderByUserService(userId);
  return createResponse(res, 200, ROOT_MESSAGES.OK, response);
});

export const getDetailOrder = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await getDetailOrderService(id);
  return createResponse(res, 200, ROOT_MESSAGES.OK, response);
});

export const createOrder = handleAsync(async (req, res) => {
  const payload = req.body;
  const response = await createOrderService(payload);
  return createResponse(res, 201, ORDER_MESSAGES.ORDER_CREATED, response);
});

export const updateOrder = handleAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const response = await updateOrderService(id, payload);
  return createResponse(res, 200, ORDER_MESSAGES.ORDER_UPDATED, response);
});

export const updateStatusOrder = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;
  const response = await updateOrderService(id, newStatus);
  return createResponse(res, 200, ORDER_MESSAGES.ORDER_UPDATED, response);
});
