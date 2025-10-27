import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import Car from "../car/car.model.js";
import { SEAT_MESSAGES } from "./seat.messages.js";
import Seat from "./seat.model.js";
import { ensureUniqueSeatLabel, generateSeat } from "./seat.utils.js";

export const createFloorSerivce = async (carId, payload) => {
  const { allSeats, totalSeats } = await generateSeat(
    carId,
    payload.floors,
    payload.floorNumber,
  );
  const createdSeats = await Seat.insertMany(allSeats);
  await Car.findByIdAndUpdate(
    carId,
    {
      $inc: {
        maxSeatCapacity: totalSeats,
      },
      totalFloor: payload.floorNumber,
    },
    { new: true },
  );

  return createdSeats;
};

export const deleteFloorService = async (seatIds, carId) => {
  const response = await Seat.deleteMany({ _id: { $in: seatIds }, carId });
  if (response.deletedCount === 0) {
    throwError(400, SEAT_MESSAGES.DELETED_FAIL_FLOOR);
  }

  await Car.findByIdAndUpdate(
    carId,
    {
      $inc: {
        maxSeatCapacity: -response.deletedCount,
        totalFloor: -1,
      },
    },
    { new: true },
  );

  return {
    data: null,
    message: SEAT_MESSAGES.DELETED_FLOOR(response.deletedCount),
  };
};

export const updateStatusFloorService = async (seatIds, carId, status) => {
  const seats = await Seat.find({ _id: { $in: seatIds }, carId });
  const updates = seats.map((seat) => ({
    updateOne: {
      filter: { _id: seat._id },
      update: { $set: { status: status } },
    },
  }));
  await Seat.bulkWrite(updates);
  return { data: { status } };
};

export const getSeatCarService = async (carId, query) => {
  const { groupFloor, ...ortherQuery } = query;
  const data = await queryBuilder(
    Seat,
    {
      sort: "seatOrder",
      order: "asc",
      disablePagination: true,
      ...ortherQuery,
      carId,
    },
    {
      populate: [{ path: "carId", select: "name licensePlate" }],
    },
  );
  const grouped = data.data.reduce((acc, seat) => {
    if (!acc[seat.floor]) acc[seat.floor] = [];
    acc[seat.floor].push(seat);
    return acc;
  }, {});
  const getCols = (seats) => {
    if (!Array.isArray(seats) || seats.length === 0) return 0;
    return Math.max(...seats.map((s) => s.col || 1));
  };
  const getRows = (seats) => {
    if (!Array.isArray(seats) || seats.length === 0) return 0;
    return Math.max(...seats.map((s) => s.row || 1));
  };
  const newResponse = Object.entries(grouped).map(([floor, seats]) => ({
    floor: Number(floor),
    rows: getRows(seats),
    cols: getCols(seats),
    seats,
  }));

  return { data: groupFloor ? newResponse : data.data, meta: data.meta };
};

export const createSeatService = async (payload) => {
  const { carId, floor, row, col, seatLabel } = payload;
  const [checkQuantitySeat, conflicts] = await Promise.all([
    Seat.countDocuments({ carId, floor }),
    Seat.find({
      carId,
      floor,
      $or: [{ row, col }, { seatLabel }],
    }).lean(),
  ]);
  if (checkQuantitySeat >= 30) {
    throwError(400, SEAT_MESSAGES.OUTMAXQUANTITY_SEAT);
  }
  const seatConflict = conflicts.find((s) => s.row === row && s.col === col);
  if (seatConflict) {
    throwError(400, SEAT_MESSAGES.SEATORDER_EXIST);
  }
  const labelConflict = conflicts.find((s) => s.seatLabel === seatLabel);
  if (labelConflict) {
    payload.seatLabel = await ensureUniqueSeatLabel(carId, floor, seatLabel);
  }
  const [seat] = await Promise.all([
    Seat.create(payload),
    Car.findByIdAndUpdate(carId, { $inc: { maxSeatCapacity: 1 } }),
  ]);

  return seat;
};

export const updateSeatService = async (id, payload) => {
  const existingSeat = await Seat.findOne({
    carId: id.carId,
    $or: [{ seatLabel: payload.seatLabel }, { seatOrder: payload.seatOrder }],
  });
  if (existingSeat) {
    throwIfDuplicate(
      existingSeat.seatLabel,
      payload.seatLabel,
      SEAT_MESSAGES.SEATLABEL_EXIST,
    );
    throwIfDuplicate(
      existingSeat.seatOrder,
      payload.seatOrder,
      SEAT_MESSAGES.SEATORDER_EXIST,
    );
  }
  const updatedSeat = await Seat.findByIdAndUpdate(id._id, payload, {
    new: true,
  });
  return updatedSeat;
};

export const updateStatusSeatService = async (id) => {
  const findSeat = await Seat.findById(id);
  if (!findSeat) {
    throwError(400, SEAT_MESSAGES.NOT_FOUND);
  }
  findSeat.status = !findSeat.status;
  const carUpdated = await findSeat.save();
  return carUpdated;
};

export const deleteSeatService = async (seatId) => {
  const checkSeat = await Seat.findById(seatId);
  if (!checkSeat) {
    throwError(400, SEAT_MESSAGES.NOTFOUND_DELETE);
  }
  const deleted = await Seat.findByIdAndDelete(seatId);
  await Seat.updateMany(
    {
      carId: deleted.carId,
      floor: deleted.floor,
      seatOrder: { $gt: deleted.seatOrder },
    },
    { $inc: { seatOrder: -1 } },
  );
  await Car.findByIdAndUpdate(deleted.carId, {
    $inc: { maxSeatCapacity: -1 },
  });
  return deleted;
};
