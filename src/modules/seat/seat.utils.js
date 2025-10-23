import { throwError } from "../../common/utils/create-response.js";
import { SEAT_MESSAGES } from "./seat.messages.js";

export const generateSeat = async (carId, floors = []) => {
  if (!carId) throwError(400, SEAT_MESSAGES.ID_REQUIRED);
  if (!Array.isArray(floors) || floors.length === 0)
    throwError(400, SEAT_MESSAGES.QUANTITY_INVALID);
  const allSeats = [];
  let seatOrder = 0;
  for (let i = 0; i < floors.length; i++) {
    const { seatCount, cols } = floors[i];
    const floorNumber = i + 1;

    if (!seatCount || !cols) {
      throwError(400, `Thiếu dữ liệu tầng ${floorNumber}`);
    }
    for (let j = 0; j < seatCount; j++) {
      seatOrder++;
      const row = Math.floor(j / cols);
      const col = (j % cols) + 1;
      const seatLabel = `${String.fromCharCode(65 + row)}${seatOrder}`;
      allSeats.push({
        carId,
        seatOrder,
        seatLabel,
        col,
        floor: floorNumber,
      });
    }
  }
  return { allSeats, totalSeats: allSeats.length };
};
