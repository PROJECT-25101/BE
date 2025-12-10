import mongoose from "mongoose";

const seatsSchema = new mongoose.Schema(
  {
    seatOrder: {
      type: Number,
      required: true,
    },
    seatLabel: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: false, _id: false },
);

const customerInfoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: false, _id: false },
);

const carInfoSchema = new mongoose.Schema(
  {
    licensePlate: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["VIP", "NORMAL"],
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: false, _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    paymentOrderCode: {
      type: String,
    },
    paymentCheckoutUrl: { type: String },
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    seats: [seatsSchema],
    customerInfo: customerInfoSchema,
    carInfo: carInfoSchema,
    pickupPoint: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    dropPoint: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["BUYED", "USED", "CANCELLED"],
      default: "BUYED",
    },
    cancelDescription: {
      type: String,
      required: function () {
        return this.status === "CANCELLED";
      },
    },
    note: {
      type: String,
    },
    expiredDate: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  { versionKey: false, timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
