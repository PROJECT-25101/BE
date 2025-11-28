import { Router } from "express";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import {
  getSeatSchedule,
  toggleSeat,
  unHoldSeat,
} from "./seat-schedule.controller.js";

const seatScheduleRoute = Router();

seatScheduleRoute.get("/seat-map/:carId/:scheduleId", getSeatSchedule);
seatScheduleRoute.use(authenticate(JWT_ACCESS_SECRET));
seatScheduleRoute.post("/toogle-seat", toggleSeat);
seatScheduleRoute.patch("/un-hold", unHoldSeat);

export default seatScheduleRoute;
