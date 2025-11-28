import cron from "node-cron";
import dayjs from "dayjs";
import SeatSchedule from "../seat-schedule/seat-schedule.model.js";
import { getIO } from "../../socket/socket.instance.js";

export const cleanExpiredSeats = async () => {
  try {
    const now = dayjs().toDate();

    const expiredSeats = await SeatSchedule.find({
      status: "hold",
      expiredHold: { $lt: now },
    });
    if (expiredSeats.length > 0) {
      const scheduleIds = expiredSeats.map((seat) =>
        seat.scheduleId.toString(),
      );
      const result = await SeatSchedule.deleteMany({
        _id: { $in: expiredSeats.map((seat) => seat._id) },
      });
      console.log(
        `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] Deleted ${result.deletedCount} expired hold seats.`,
      );
      const io = getIO();
      scheduleIds.forEach((scheduleId) => {
        io.to(scheduleId).emit("seatUpdated", {
          message: "Some held seats have expired",
          deletedCount: result.deletedCount,
          timestamp: dayjs().toISOString(),
        });
      });
    }
  } catch (error) {
    console.error("Error cleaning expired hold seats:", error);
  }
};

export const startSeatExpiredJob = () => {
  console.log("✓ Seat cleanup job started.");
  const task = cron.schedule("* * * * *", async () => {
    console.log("✓ Seat cleanup runtime.");
    await cleanExpiredSeats();
  });
  return task;
};
