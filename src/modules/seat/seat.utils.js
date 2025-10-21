import { throwError } from "../../common/utils/create-response.js";
import { SEAT_MESSAGES } from "./seat.messages.js";

export const generateSeat = async (config = {}) => {
  let { carId, seatQuantity = 16, colsCount = 3, floors = 1 } = config;
  if (!carId) {
    throwError(400, SEAT_MESSAGES.ID_REQUIRED);
  }
  seatQuantity = Number(seatQuantity);
  colsCount = Number(colsCount);
  if (isNaN(seatQuantity) || seatQuantity < 1) {
    throwError(400, SEAT_MESSAGES.QUANTITY_INVALID);
  }
  if (isNaN(colsCount) || colsCount < 1) {
    throwError(400, "Số lượng cột không hợp lệ");
  }
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const cols = Array.from(
    { length: colsCount },
    (_, i) => alphabet[i] || `C${i + 1}`,
  );
  const seatsPerFloor = Math.ceil(seatQuantity / floors);
  const rows = Math.ceil(seatsPerFloor / colsCount);
  const seats = [];
  let seatOrder = 0;
  for (let floor = 1; floor <= floors; floor++) {
    for (let row = 1; row <= rows; row++) {
      for (let col of cols) {
        if (seatOrder >= seatQuantity) break;
        const seatLabel =
          floors > 1 ? `${col}${row}-T${floor}` : `${col}${row}`;
        seats.push({
          carId,
          seatOrder: seatOrder++,
          seatLabel,
          floor,
        });
      }
    }
  }
  return seats;
};
