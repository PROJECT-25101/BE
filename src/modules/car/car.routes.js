import { Router } from "express";
import {
  createCar,
  getAllCar,
  getDetailCar,
  updateCar,
  updateStatusCar,
} from "./car.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validRole } from "../../common/middlewares/role.middleware.js";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";

const carRoute = Router();

carRoute.get("/", getAllCar);
carRoute.get("/detail/:id", getDetailCar);
carRoute.use(authenticate(JWT_ACCESS_SECRET), validRole("admin"));
carRoute.post("/", createCar);
carRoute.patch("/update/:id", updateCar);
carRoute.patch("/status/:id", updateStatusCar);

export default carRoute;
