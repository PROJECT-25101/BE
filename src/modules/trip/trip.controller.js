import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { TRIP_MESSAGES } from "./trip.messages.js";
import {
  createManyTripService,
  createTripService,
  getAllTripService,
  getDetailTripService,
} from "./trip.service.js";

export const createTrip = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await createTripService(body);
  return createResponse(res, 201, TRIP_MESSAGES.CREATE_SUCCESS, data);
});

export const createManyTrip = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await createManyTripService(body);
  return createResponse(res, 201, TRIP_MESSAGES.CREATE_SUCCESS, data);
});

export const getAllTrip = handleAsync(async (req, res) => {
  const { query } = req;
  const data = await getAllTripService(query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data.data, data.meta);
});

export const getDetailTrip = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getDetailTripService(id);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data);
});
