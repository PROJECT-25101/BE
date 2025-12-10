import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  extendHoldSeatTime,
  getSeatScheduleService,
  toggleSeatService,
  unHoldSeatService,
} from "./seat-schedule.service.js";

export const getSeatSchedule = handleAsync(async (req, res) => {
  const { carId, scheduleId } = req.params;
  const seats = await getSeatScheduleService(carId, scheduleId);
  return createResponse(res, 200, ROOT_MESSAGES.OK, seats);
});

export const toggleSeat = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const { body } = req;
  const data = await toggleSeatService(body, _id);
  return createResponse(res, 201, ROOT_MESSAGES.OK, data);
});

export const unHoldSeat = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const data = await unHoldSeatService(_id);
  return createResponse(res, 200, "OK", data);
});

export const extendHoldSeat = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const { scheduleId } = req.params;
  const { seatIds } = req.body;
  const data = await extendHoldSeatTime(_id, scheduleId, seatIds);
  return createResponse(res, 200, "OK", data);
});
