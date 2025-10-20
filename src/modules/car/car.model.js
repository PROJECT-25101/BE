import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    engine: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    _id: false,
  },
);

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    model: modelSchema,
    maxSeatCapacity: {
      type: Number,
      default: 16,
    },
    type: {
      type: String,
      enum: ["VIP", "NORMAL"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Car = mongoose.model("Car", carSchema);
export default Car;
