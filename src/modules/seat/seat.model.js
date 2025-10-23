import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    seatOrder: {
      type: Number,
      required: true,
    },
    seatLabel: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    col: {
      type: Number,
      default: 1,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
