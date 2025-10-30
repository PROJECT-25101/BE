import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { versionKey: false, timestamps: false, _id: false },
);

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: String,
    viaCities: [pointSchema],
    pickupPoint: pointSchema,
    dropPoint: pointSchema,
    routePrice: {
      type: Number,
      required: true,
    },
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
