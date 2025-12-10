import dayjs from "dayjs";
import { throwError } from "../../common/utils/create-response.js";
import Car from "../car/car.model.js";
import Route from "../route/route.model.js";
import Schedule from "../schedule/schedule.model.js";
import Seat from "../seat/seat.model.js";

export const checkAvailableCar = async (carId) => {
  const car = await Car.findById(carId);
  if (!car) throwError(400, "Xe bạn đặt không tồn tại trong hệ thống!");
  if (!car.status)
    throwError(
      400,
      `Xe ${car.licensePlate} hiện không khả dụng vui lòng thử lại`,
    );
  return true;
};

export const checkAvailableRoute = async (routeId) => {
  const route = await Route.findById(routeId);
  if (!route)
    throwError(400, "Tuyến đường bạn đặt không tồn tại trong hệ thống!");
  if (!route.status)
    throwError(
      400,
      `Tuyến đường ${route.pickupPoint.label} - ${route.dropPoint.label} hiện không khả dụng vui lòng thử lại`,
    );
};

export const checkAvailableSchedule = async (scheduleId) => {
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule)
    throwError(400, "Lịch chạy bạn đặt không tồn tại trong hệ thống");
  if (schedule.status === "cancelled") {
    throwError(
      400,
      `Lịch chạy ${dayjs(schedule.startTime).format("HH:mm - DD/MM/YYYY")} không khả dụng vui lòng thử lại`,
    );
  }
  return true;
};

export const checkAvailableSeat = async (seatIds) => {
  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    throwError(400, "Danh sách ghế không hợp lệ");
  }
  const seats = await Seat.find({ _id: { $in: seatIds } });
  if (seats.length !== seatIds.length) {
    throwError(400, "Một hoặc nhiều ghế không tồn tại trong hệ thống");
  }
  const invalidSeats = seats.filter(
    (seat) => seat.status === "buyed" || seat.status === "used",
  );
  if (invalidSeats.length > 0) {
    const seatLabels = invalidSeats.map((s) => s.label).join(", ");
    throwError(400, `Ghế ${seatLabels} đã được đặt hoặc không còn khả dụng`);
  }
  return true;
};
