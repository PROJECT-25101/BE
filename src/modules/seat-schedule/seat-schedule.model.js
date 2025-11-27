import mongoose from "mongoose";

const seatScheduleSchema = new mongoose.Schema(
  {
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["hold", "booked"],
      default: "hold",
    },
    expiredHold: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SeatSchedule = mongoose.model("SeatSchedule", seatScheduleSchema);
export default SeatSchedule;
