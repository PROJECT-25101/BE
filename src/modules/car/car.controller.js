import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { CAR_MESSAGES } from "./car.messages.js";
import {
  createCarService,
  getAllCarService,
  getDetailCarService,
  updateCarService,
  updateStatusCarService,
} from "./car.service.js";

export const getAllCar = handleAsync(async (req, res) => {
  const query = req.query;
  const { data, meta } = await getAllCarService(query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data, meta);
});

export const getDetailCar = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await getDetailCarService(id);
  return createResponse(res, 200, ROOT_MESSAGES.OK, response);
});

export const createCar = handleAsync(async (req, res) => {
  const payload = req.body;
  const response = await createCarService(payload);
  return createResponse(res, 201, CAR_MESSAGES.CREATE_SUCCESS, response);
});

export const updateCar = handleAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const response = await updateCarService(id, payload);
  return createResponse(res, 201, CAR_MESSAGES.UPDATE_SUCCESS, response);
});

export const updateStatusCar = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await updateStatusCarService(id);
  return createResponse(
    res,
    200,
    response.status ? CAR_MESSAGES.ACTIVATED : CAR_MESSAGES.DEACTIVATED,
    response,
  );
});
