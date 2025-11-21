import { Router } from "express";
import {
  createManySchedule,
  createSchedule,
  getAllSchedule,
  getDetailSchedule,
  insertManyContinueSchedule,
  updateSchedule,
  updateStatusSchedule,
} from "./schedule.controller.js";

const scheduleRoute = Router();

scheduleRoute.get("/", getAllSchedule);
scheduleRoute.get("/detail/:id", getDetailSchedule);
scheduleRoute.post("/", createSchedule);
scheduleRoute.post("/many", createManySchedule);
scheduleRoute.post("/many-continue", insertManyContinueSchedule);
scheduleRoute.patch("/update/:id", updateSchedule);
scheduleRoute.patch("/update-disable/:id", updateStatusSchedule);

export default scheduleRoute;
