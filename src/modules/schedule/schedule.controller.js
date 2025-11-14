import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { SCHEDULE_MESSAGES } from "./schedule.messages.js";
import {
  createManyScheduleService,
  createScheduleService,
  getAllScheduleService,
  getDetailScheduleService,
  updateScheduleService,
  updateStatusScheduleService,
} from "./schedule.service.js";

export const getAllSchedule = handleAsync(async (req, res) => {
  const query = req.query;
  const { data, meta } = await getAllScheduleService(query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data, meta);
});

export const getDetailSchedule = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await getDetailScheduleService(id);
  return createResponse(res, 200, ROOT_MESSAGES.OK, response);
});

export const createSchedule = handleAsync(async (req, res) => {
  const payload = req.body;
  const response = await createScheduleService(payload);
  return createResponse(res, 201, SCHEDULE_MESSAGES.CREATED_SCHEDULE, response);
});

export const createManySchedule = handleAsync(async (req, res) => {
  const payload = req.body;
  const response = await createManyScheduleService(payload);
  return createResponse(
    res,
    201,
    SCHEDULE_MESSAGES.CREATE_MANY_SCHEDULE(
      response.createdSchedules.length,
      response.failedSchedules.length,
    ),
    response,
  );
});

export const updateSchedule = handleAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const response = await updateScheduleService(id, payload);
  return createResponse(res, 200, SCHEDULE_MESSAGES.UPDATED_SCHEDULE, response);
});

export const updateStatusSchedule = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await updateStatusScheduleService(id);
  return createResponse(
    res,
    200,
    response.status
      ? SCHEDULE_MESSAGES.ACTIVATED
      : SCHEDULE_MESSAGES.DEACTIVATED,
    response,
  );
});
