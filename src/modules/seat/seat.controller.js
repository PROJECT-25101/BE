import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse, {
  throwError,
} from "../../common/utils/create-response.js";
import { SEAT_MESSAGES } from "./seat.messages.js";
import {
  createFloorSerivce,
  createSeatService,
  deleteFloorService,
  deleteSeatService,
  getSeatCarService,
  updateSeatService,
  updateStatusFloorService,
  updateStatusSeatService,
} from "./seat.service.js";

export const createFloor = handleAsync(async (req, res) => {
  const { carId, ...payload } = req.body;
  const data = await createFloorSerivce(carId, payload);
  return createResponse(res, 201, ROOT_MESSAGES.OK, data);
});

export const deleteFloor = handleAsync(async (req, res) => {
  const { seatIds, carId } = req.body;
  if (!seatIds || seatIds.length === 0) {
    throwError(400, SEAT_MESSAGES.NOTFOUND_DELETE);
  }
  const data = await deleteFloorService(seatIds, carId);
  return createResponse(res, 200, data.message, data.data);
});

export const updateStatusFloor = handleAsync(async (req, res) => {
  const { seatIds, carId, status } = req.body;
  if (!seatIds || seatIds.length === 0) {
    throwError(400, SEAT_MESSAGES.NOTFOUND_DELETE);
  }
  const data = await updateStatusFloorService(seatIds, carId, status);
  return createResponse(
    res,
    200,
    data.status ? SEAT_MESSAGES.ACTIVE_FLOOR : SEAT_MESSAGES.DEACTIVE_FLOOR,
    data.data,
  );
});

export const getCarSeat = handleAsync(async (req, res) => {
  const { id: carId } = req.params;
  const query = req.query;
  const { data, meta } = await getSeatCarService(carId, query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data, meta);
});

export const createSeat = handleAsync(async (req, res) => {
  const payload = req.body;
  const response = await createSeatService(payload);
  return createResponse(res, 201, SEAT_MESSAGES.CREATED, response);
});

export const updateSeat = handleAsync(async (req, res) => {
  const { carId, id } = req.params;
  const idPayload = {
    _id: id,
    carId,
  };
  const response = await updateSeatService(idPayload, req.body);
  return createResponse(res, 200, ROOT_MESSAGES.OK, response);
});

export const updateStatusSeat = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await updateStatusSeatService(id);
  return createResponse(
    res,
    200,
    response.status ? SEAT_MESSAGES.ACTIVATED : SEAT_MESSAGES.DEACTIVATED,
    response,
  );
});

export const deleteSeat = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await deleteSeatService(id);
  return createResponse(res, 200, SEAT_MESSAGES.DELETED_SEAT, response);
});
