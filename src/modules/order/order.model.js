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

const districtSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    label: { type: String, required: true },
    description: [{ type: String, required: true }],
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

const routeInfoSchema = new mongoose.Schema(
  {
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
  },
  { versionKey: false, timestamps: false, _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    paymentOrderCode: {
      type: String,
      // unique: true,
    },
    paymentTransactionId: {
      type: String,
    },
    paymentCheckoutUrl: { type: String },
    paymentHistory: {
      type: Array,
      default: [],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
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
    routeInfo: routeInfoSchema,
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "confirmed",
        "canceled",
        "completed",
        "expired",
      ],
      default: "pending",
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
