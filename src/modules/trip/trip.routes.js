import { Router } from "express";
import {
  createManyTrip,
  createTrip,
  getAllTrip,
  getDetailTrip,
} from "./trip.controller.js";

const tripRoute = Router();

tripRoute.get("/", getAllTrip);
tripRoute.get("/detail/:id", getDetailTrip);
tripRoute.post("/create", createTrip);
tripRoute.post("/create-many", createManyTrip);

export default tripRoute;
