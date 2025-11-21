import dayjs from "dayjs";
import { throwError } from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import Car from "../car/car.model.js";
import Route from "../route/route.model.js";
import { SCHEDULE_MESSAGES } from "./schedule.messages.js";
import Schedule from "./schedule.model.js";
import {
  checkConflictTime,
  generateManySchedules,
  groupedSchedules,
} from "./schedule.utils.js";

const populateSchedule = [
  { path: "carId", select: "-createdAt -updatedAt" },
  { path: "routeId", select: "-createdAt -updatedAt" },
  { path: "crew.userId", select: "userName email phone" },
];

export const getAllScheduleService = async (query) => {
  const { groupSchedule, ...otherQuery } = query;
  const schedules = await queryBuilder(
    Schedule,
    { disablePagination: groupSchedule ? true : false, ...otherQuery },
    {
      populate: populateSchedule,
    },
  );
  if (groupSchedule) {
    return groupedSchedules(schedules.data, query);
  }

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
  const { carId, routeId, startTime, crew } = payload;
  const startT = new Date(startTime);
  const backupTime = 0;
  const { duration } = await Route.findById(routeId);
  const arrivalT = new Date(
    startT.getTime() + (duration + backupTime) * 3600000,
  );
  const crewIds = crew.map((item) => item.userId);
  const scheduleConflict = await checkConflictTime(
    carId,
    crewIds,
    startT,
    arrivalT,
  );
  if (scheduleConflict) {
    throwError(400, scheduleConflict.message);
    //có nên làm cái gì đấy để người dùng chọn giữ cái nào không?
  }
  payload.arrivalTime = arrivalT;
  const createdSchedule = await Schedule.create({
    dayOfWeek: startT.getDay(),
    ...payload,
  });
  return createdSchedule;
};

export const createManyScheduleService = async (payload) => {
  const { createdSchedules, failedSchedules } =
    await generateManySchedules(payload);
  const isFailed = failedSchedules.length !== 0;
  let schedules = null;
  if (!isFailed) {
    schedules = await Schedule.insertMany(createdSchedules);
  }
  return {
    createdSchedules,
    failedSchedules,
  };
};

export const insertContinueManyScheduleService = async (payload) => {
  for (const schedule of payload) {
    const { carId, crew, startTime, arrivalTime } = schedule;
    const crewIds = crew.map((item) => item._id);
    const conflict = await checkConflictTime(
      carId,
      crewIds,
      startTime,
      arrivalTime,
    );

    if (conflict) {
      throwError(400, "Tạo lịch thất bại do trùng thời gian");
    }
  }
  return await Schedule.insertMany(payload);
};

export const updateScheduleService = async (id, payload) => {
  const { carId, routeId, crew, startTime } = payload;
  const startT = dayjs(startTime).toDate();
  const { duration } = await Route.findById(routeId);
  const arrivalT = dayjs(startTime).add(duration, "hour").toDate();
  const crewIds = crew.map((item) => item.userId);
  const scheduleConflict = await checkConflictTime(
    carId,
    crewIds,
    startT,
    arrivalT,
    id,
  );
  if (scheduleConflict) {
    throwError(400, SCHEDULE_MESSAGES.CONFLICT_SCHEDULE(scheduleConflict));
    //có nên làm cái gì đấy để người dùng chọn giữ cái nào không?
  }
  payload.arrivalTime = arrivalT;
  // Nếu như schedule này đã có người đặt thì sao?
  if (payload.status === "cancelled") {
    payload.isDisable = true;
    payload.disableBy = "handle";
  }
  const updated = await Schedule.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

export const updateStatusScheduleService = async (id) => {
  const schedule = await Schedule.findById(id).lean();
  if (!schedule) throwError(400, SCHEDULE_MESSAGES.NOT_FOUND_SCHEDULE);
  if (schedule.status === "cancelled") {
    throwError(400, "Lịch chạy này đã bị huỷ không thể khoả hoặc mở khoá!");
  }
  const { isDisable, carId, crew, routeId, startTime, arrivalTime } = schedule;
  const crewIds = crew.map((item) => item.userId);
  if (isDisable) {
    const [conflict, route, car] = await Promise.all([
      checkConflictTime(carId, crewIds, startTime, arrivalTime, id),
      Route.findById(routeId).lean(),
      Car.findById(carId).lean(),
    ]);
    if (conflict) throwError(400, SCHEDULE_MESSAGES.CONFLICT_SCHEDULE);
    if (!route || !route.status)
      throwError(400, SCHEDULE_MESSAGES.ROUTE_NOT_AVAILABLE);
    if (!car || !car.status)
      throwError(400, SCHEDULE_MESSAGES.CAR_NOT_AVAILABLE);
  }
  // Nếu như schedule này đã có người đặt thì sao?
  const updated = await Schedule.findByIdAndUpdate(
    id,
    {
      $set: {
        isDisable: !isDisable,
        disableBy: isDisable ? "service" : "handle",
      },
    },
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
  })
    .populate(populateSchedule[0])
    .populate(populateSchedule[1])
    .lean();
  if (!schedules?.length) throwError(400, SCHEDULE_MESSAGES.NOT_FOUND_SCHEDULE);
  if (!newStatus) {
    const results = await Schedule.updateMany(
      { [filterKey]: filterValue, disableBy: "service" },
      { $set: { isDisable: true } },
    );
    return results;
  }
  let unlockScheduleSuccess = 0;
  let unlockScheduleFailed = [];
  const results = await Promise.allSettled(
    schedules.map(async (schedule) => {
      const {
        _id,
        carId,
        crew,
        routeId,
        startTime,
        arrivalTime,
        disableBy,
        status,
      } = schedule;
      const crewIds = crew.map((item) => item.userId);
      const [conflict, route, car] = await Promise.all([
        checkConflictTime(carId, crewIds, startTime, arrivalTime, _id),
        Route.findById(routeId._id).lean(),
        Car.findById(carId._id).lean(),
      ]);
      if (conflict) {
        unlockScheduleFailed += 1;
        throwError(400, SCHEDULE_MESSAGES.CONFLICT_SCHEDULE);
      }
      if (!route?.status) {
        unlockScheduleFailed += 1;
        throwError(400, SCHEDULE_MESSAGES.ROUTE_NOT_AVAILABLE);
      }
      if (!car?.status) {
        unlockScheduleFailed += 1;
        throwError(400, SCHEDULE_MESSAGES.CAR_NOT_AVAILABLE);
      }
      if (disableBy === "handle") {
        unlockScheduleFailed += 1;
        throwError(400, SCHEDULE_MESSAGES.DISABLE_BY_HANDLE);
      }
      if (status) {
        unlockScheduleFailed += 1;
        throwError(400, "NULL");
      }
      await Schedule.findOneAndUpdate(
        {
          _id,
          disableBy: "service",
        },
        { $set: { isDisable: false } },
      );
      unlockScheduleSuccess += 1;
      return _id;
    }),
  );
  return { results, unlockScheduleSuccess, unlockScheduleFailed };
};
