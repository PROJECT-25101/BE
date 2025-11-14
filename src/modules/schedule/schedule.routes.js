import { Router } from "express";
import {
  createManySchedule,
  createSchedule,
  getAllSchedule,
  getDetailSchedule,
  updateSchedule,
  updateStatusSchedule,
} from "./schedule.controller.js";

const scheduleRoute = Router();

scheduleRoute.get("/", getAllSchedule);
scheduleRoute.get("/detail/:id", getDetailSchedule);
scheduleRoute.post("/", createSchedule);
scheduleRoute.post("/many", createManySchedule);
scheduleRoute.patch("/update/:id", updateSchedule);
scheduleRoute.patch("/status/:id", updateStatusSchedule);

export default scheduleRoute;
