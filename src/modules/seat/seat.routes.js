import { Router } from "express";
import { getCarSeat, updateSeat, updateStatusSeat } from "./seat.controller.js";

const seatRoute = Router();

seatRoute.get("/car/:id", getCarSeat);
seatRoute.patch("/update/:carId/:id", updateSeat);
seatRoute.patch("/status/:id", updateStatusSeat);

export default seatRoute;
