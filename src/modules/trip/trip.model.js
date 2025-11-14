import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
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
    crew: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        role: {
          type: String,
          enum: ["driver", "assistant"],
          required: true,
        },
      },
    ],
    startTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    weekdays: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
