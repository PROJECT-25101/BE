import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    label: { type: String, required: true },
    description: [String],
  },
  { _id: false },
);

const pointSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String },
    district: [districtSchema],
  },
  { versionKey: false, timestamps: false, _id: false },
);

const routeSchema = new mongoose.Schema(
  {
    description: String,
    pickupPoint: pointSchema,
    dropPoint: pointSchema,
    distance: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
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

const Route = mongoose.model("Route", routeSchema);

export default Route;
