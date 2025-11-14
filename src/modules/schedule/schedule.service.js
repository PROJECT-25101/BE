import { throwError } from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import Car from "../car/car.model.js";
import Route from "../route/route.model.js";
import { SCHEDULE_MESSAGES } from "./schedule.messages.js";
import Schedule from "./schedule.model.js";
import { checkConflictTime } from "./schedule.utils.js";

export const getAllScheduleService = async (query) => {
  const schedules = await queryBuilder(Schedule, query);
  const populatedSchedules = await Schedule.populate(schedules.data, [
    { path: "carId" },
    { path: "routeId" },
  ]);
  return schedules;
};

export const getDetailScheduleService = async (id) => {
  const response = await Schedule.findById(id)
    .populate("carId")
    .populate("routeId")
    .lean();
  if (!response) {
    throwError(400, SCHEDULE_MESSAGES.NOT_FOUND_SCHEDULE);
  }
  return response;
};

export const createScheduleService = async (payload) => {
  const { carId, routeId, startTime } = payload;
  const startT = new Date(startTime);
  const backupTime = 2;
  const { duration } = await Route.findById(routeId);
  const arrivalT = new Date(
    startT.getTime() + (duration + backupTime) * 3600000,
  );
  const scheduleConflict = await checkConflictTime(carId, startT, arrivalT);
  if (scheduleConflict) {
    throwError(400, SCHEDULE_MESSAGES.CONFLICT_SCHEDULE);
    //có nên làm cái gì đấy để người dùng chọn giữ cái nào không?
  }
  payload.arrivalTime = arrivalT;
  const createdSchedule = await Schedule.create(payload);
  return createdSchedule;
};

export const createManyScheduleService = async (payload) => {
  const { carId, routeId, startTime, untilTime } = payload;
  const startT = new Date(startTime);
  const untilT = new Date(untilTime);

  const baseHour = startT.getHours();
  const baseMinute = startT.getMinutes();
  const baseSecond = startT.getSeconds();

  const route = await Route.findById(routeId).lean();
  const { duration } = route;
  const backupTime = 2;

  const createdSchedules = [];
  const failedSchedules = [];

  let currentStart = new Date(startT);

  while (currentStart <= untilT) {
    try {
      const newPayload = {
        ...payload,
        startTime: new Date(currentStart),
      };

      const schedule = await createScheduleService(newPayload);
      createdSchedules.push(schedule);

      const arrivalT = new Date(schedule.arrivalTime);
      currentStart = new Date(arrivalT);
      currentStart.setDate(arrivalT.getDate() + 1);
      currentStart.setHours(baseHour, baseMinute, baseSecond, 0);
    } catch (error) {
      failedSchedules.push({
        dayConflict: new Date(currentStart),
        carId: carId,
        routeId: routeId,
      });

      const skipMs = (duration + backupTime) * 3600000;
      const skipDay = new Date(currentStart.getTime() + skipMs);
      skipDay.setDate(skipDay.getDate() + 1);
      skipDay.setHours(baseHour, baseMinute, baseSecond, 0);
      currentStart = skipDay;
    }
  }
  console.log(createdSchedules.length, failedSchedules.length);
  return { createdSchedules, failedSchedules };
};

export const updateScheduleService = async (id, payload) => {
  const { carId, routeId, startTime } = payload;
  const startT = new Date(startTime);
  const backupTime = 2;
  const { duration } = await Route.findById(routeId);
  const arrivalT = new Date(
    startT.getTime() + (duration + backupTime) * 3600000,
  );
  const scheduleConflict = await checkConflictTime(carId, startT, arrivalT, id);
  if (scheduleConflict) {
    throwError(400, SCHEDULE_MESSAGES.CONFLICT_SCHEDULE(scheduleConflict));
    //có nên làm cái gì đấy để người dùng chọn giữ cái nào không?
  }
  payload.arrivalTime = arrivalT;
  // Nếu như schedule này đã có người đặt thì sao?
  const updated = await Schedule.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

export const updateStatusScheduleService = async (id) => {
  const schedule = await Schedule.findById(id).lean();
  if (!schedule) throwError(400, SCHEDULE_MESSAGES.NOT_FOUND_SCHEDULE);
  const { status, carId, routeId, startTime, arrivalTime, isDisable } =
    schedule;
  if (!status) {
    const [conflict, route, car] = await Promise.all([
      checkConflictTime(carId, startTime, arrivalTime, id),
      Route.findById(routeId).lean(),
      Car.findById(carId).lean(),
    ]);
    checkConflictTime(carId, startTime, arrivalTime, id);
    if (conflict) throwError(400, SCHEDULE_MESSAGES.CONFLICT_SCHEDULE);
    if (!route || !route.status)
      throwError(400, SCHEDULE_MESSAGES.ROUTE_NOT_AVAILABLE);
    if (!car || !car.status)
      throwError(400, SCHEDULE_MESSAGES.CAR_NOT_AVAILABLE);
  }
  // Nếu như schedule này đã có người đặt thì sao?
  const updated = await Schedule.findByIdAndUpdate(
    id,
    { $set: { status: !status, isDisable: !isDisable } },
    { new: true },
  );
  return updated;
};

export const updateStatusManySchedule = async (
  filterKey,
  filterValue,
  newStatus,
) => {
  const schedules = await Schedule.find({
    [filterKey]: filterValue,
    isDisable: { $ne: true },
  }).lean();
  if (!schedules?.length) throwError(400, SCHEDULE_MESSAGES.NOT_FOUND_SCHEDULE);

  if (!newStatus) {
    return await Schedule.updateMany(
      { [filterKey]: filterValue },
      { $set: { status: false } },
    );
  }

  const results = await Promise.allSettled(
    schedules.map(
      async ({ _id, carId, routeId, startTime, arrivalTime, isDisable }) => {
        const [conflict, route, car] = await Promise.all([
          checkConflictTime(carId, startTime, arrivalTime, _id),
          Route.findById(routeId).lean(),
          Car.findById(carId).lean(),
        ]);

        if (conflict)
          throwError(400, SCHEDULE_MESSAGES.CONFLICT_SCHEDULE(conflict));
        if (!route?.status)
          throwError(400, SCHEDULE_MESSAGES.ROUTE_NOT_AVAILABLE);
        if (!car?.status) throwError(400, SCHEDULE_MESSAGES.CAR_NOT_AVAILABLE);
        if (!isDisable) {
          await Schedule.findByIdAndUpdate(_id, { $set: { status: true } });
        }
        return _id;
      },
    ),
  );

  return results;
};
