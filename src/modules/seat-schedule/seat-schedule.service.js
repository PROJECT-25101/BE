import { throwError } from "../../common/utils/create-response.js";
import { getIO } from "../../socket/socket.instance.js";
import Schedule from "../schedule/schedule.model.js";
import Seat from "../seat/seat.model.js";
import SeatSchedule from "./seat-schedule.model.js";

export const getSeatScheduleService = async (carId, scheduleId) => {
  const seats = await Seat.find({ carId }).lean();
  const seatSchedules = await SeatSchedule.find({ scheduleId }).lean();
  const scheduleData = await Schedule.findById(scheduleId);
  const result = seats.map((seat) => {
    const schedule = seatSchedules.find(
      (s) => s.seatId.toString() === seat._id.toString(),
    );
    let bookingStatus = "available";
    let userId = null;
    if (schedule) bookingStatus = schedule.status;
    if (schedule) userId = schedule.userId;
    return {
      ...seat,
      userId,
      price: scheduleData.price,
      bookingStatus,
    };
  });
  const grouped = result.reduce((acc, seat) => {
    if (!acc[seat.floor]) acc[seat.floor] = [];
    acc[seat.floor].push(seat);
    return acc;
  }, {});
  const getCols = (seats) => {
    if (!Array.isArray(seats) || seats.length === 0) return 0;
    return Math.max(...seats.map((s) => s.col || 1));
  };
  const getRows = (seats) => {
    if (!Array.isArray(seats) || seats.length === 0) return 0;
    return Math.max(...seats.map((s) => s.row || 1));
  };
  const newResponse = Object.entries(grouped).map(([floor, seats]) => ({
    floor: Number(floor),
    rows: getRows(seats),
    cols: getCols(seats),
    seats,
  }));
  return newResponse;
};

export const toggleSeatService = async (payload, userId) => {
  const existing = await SeatSchedule.findOne({ seatId: payload.seatId });
  if (existing) {
    if (existing.userId.toString() !== userId.toString()) {
      const isHold = existing.status === "hold";
      throwError(
        400,
        `Ghế ${isHold ? "đang được giữ!" : "đã được đặt trước đó!"}`,
      );
    }
    if (existing.status === "hold") {
      await existing.deleteOne();
      const io = getIO();
      io.to(existing.scheduleId.toString()).emit("seatUpdated", {
        seatId: existing.seatId,
        scheduleId: existing.scheduleId,
        status: "available",
      });
      return { message: "Đã bỏ giữ ghế" };
    }
    if (existing.status === "booked") {
      throwError(400, "Bạn đã đặt ghế này rồi!");
    }
  }
  const count = await SeatSchedule.countDocuments({
    userId,
  });
  if (count === 4)
    throwError(400, "Bạn chỉ được phép giữ 4 ghé. Để đảm bảo hệ thống!");
  const seat = await SeatSchedule.create({ userId, ...payload });
  const io = getIO();
  io.to(payload.scheduleId.toString()).emit("seatUpdated", {
    seatId: seat.seatId,
    scheduleId: seat.scheduleId,
    status: seat.status,
  });
  return seat;
};
