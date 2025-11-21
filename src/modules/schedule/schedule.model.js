import mongoose from "mongoose";

const crewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "driver";
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["driver", "assistant"],
    },
  },
  { _id: false, versionKey: false, timestamps: false },
);

const scheduleSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    crew: [crewSchema],
    arrivalTime: {
      type: Date,
    },
    dayOfWeek: {
      type: Number,
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "running",
        "completed",
        "pendingCancel",
        "cancelled",
      ],
      default: "pending",
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
    disableBy: {
      type: String,
      enum: ["service", "handle"],
      default: "service",
    },
    cancelDescription: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
