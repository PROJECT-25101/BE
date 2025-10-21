import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { SEAT_MESSAGES } from "./seat.messages.js";
import {
  getSeatCarService,
  updateSeatService,
  updateStatusSeatService,
} from "./seat.service.js";

export const getCarSeat = handleAsync(async (req, res) => {
  const { id: carId } = req.params;
  const query = req.query;
  const { data, meta } = await getSeatCarService(carId, query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data, meta);
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
