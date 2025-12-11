import SeatSchedule from "./seat-schedule.model.js";

export const updateBookedSeats = async (userId, scheduleId, seatIds) => {
  if (!Array.isArray(seatIds) || seatIds.length === 0) return;
  const seatsUpdated = await SeatSchedule.updateMany(
    { seatId: { $in: seatIds }, userId, scheduleId },
    { $set: { status: "booked" } },
  );
  return seatsUpdated;
};
