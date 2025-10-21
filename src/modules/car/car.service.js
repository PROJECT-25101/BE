import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import Seat from "../seat/seat.model.js";
import { generateSeat } from "../seat/seat.utils.js";
import { CAR_MESSAGES } from "./car.messages.js";
import Car from "./car.model.js";

export const getAllCarService = async (query) => {
  const response = await queryBuilder(Car, query);
  return response;
};

export const getDetailCarService = async (id) => {
  const response = await Car.findById(id);
  if (!response) {
    throwError(400, CAR_MESSAGES.NOT_FOUND);
  }
  return response;
};

export const createCarService = async (payload) => {
  const existingCar = await Car.findOne(
    {
      $or: [
        { name: new RegExp(`^${payload.name}$`, "i") },
        { licensePlate: new RegExp(`^${payload.licensePlate}$`, "i") },
      ],
    },
    null,
  );
  if (existingCar) {
    const { name, licensePlate } = existingCar;
    throwIfDuplicate(name, payload.name, CAR_MESSAGES.EXISTING_CAR_NAME);
    throwIfDuplicate(
      licensePlate,
      payload.licensePlate,
      CAR_MESSAGES.EXISTING_CAR_LICENSE,
    );
  }
  const car = await Car.create(payload);
  const seats = await generateSeat({
    carId: car._id,
    seatQuantity: payload?.maxSeatCapacity,
    column: payload?.column,
  });
  await Seat.insertMany(seats);
  return car;
};

export const updateCarService = async (id, payload) => {
  const existingCar = await Car.findOne({
    _id: { $ne: id },
    $or: [
      { name: new RegExp(`^${payload.name}$`, "i") },
      { licensePlate: new RegExp(`^${payload.licensePlate}$`, "i") },
    ],
  });
  if (existingCar) {
    const { name, licensePlate } = existingCar;
    throwIfDuplicate(name, payload.name, CAR_MESSAGES.EXISTING_CAR_NAME);
    throwIfDuplicate(
      licensePlate,
      payload.licensePlate,
      CAR_MESSAGES.EXISTING_CAR_LICENSE,
    );
  }
  const car = await Car.findByIdAndUpdate(id, payload, { new: true });
  return car;
};

export const updateStatusCarService = async (id) => {
  const car = await Car.findById(id);
  if (!car) {
    throwError(400, CAR_MESSAGES.NOT_FOUND);
  }
  car.status = !car.status;
  await car.save();
  return car;
};
