import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { regexLower } from "../../common/utils/regex.js";
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
        { name: regexLower(payload.name) },
        { licensePlate: regexLower(payload.licensePlate) },
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
  const { allSeats, totalSeats } = await generateSeat(car._id, payload.floors);
  await Seat.insertMany(allSeats);
  car.maxSeatCapacity = totalSeats;
  car.totalFloor = payload.floors.length;
  await car.save();
  return car;
};

export const updateCarService = async (id, payload) => {
  const existingCar = await Car.findOne({
    _id: { $ne: id },
    $or: [
      { name: regexLower(payload.name) },
      { licensePlate: regexLower(payload.licensePlate) },
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
