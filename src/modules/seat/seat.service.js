import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { SEAT_MESSAGES } from "./seat.messages.js";
import Seat from "./seat.model.js";

export const getSeatCarService = async (carId, query) => {
  const data = await queryBuilder(
    Seat,
    {
      sort: "seatOrder",
      order: "asc",
      ...query,
      carId,
      disablePagination: true,
    },
    {
      populate: [{ path: "carId", select: "name licensePlate" }],
    },
  );
  return data;
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
