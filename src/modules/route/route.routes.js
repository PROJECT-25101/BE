import { Router } from "express";
import {
  createRoute,
  getAllRoute,
  getDetailRoute,
  updateRoute,
  updateStatusRoute,
} from "./route.controller.js";
import { validRole } from "../../common/middlewares/role.middleware.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";

const routeRoadRoute = Router();

routeRoadRoute.get("/", getAllRoute);
routeRoadRoute.get("/detail/:id", getDetailRoute);
routeRoadRoute.use(authenticate(JWT_ACCESS_SECRET), validRole("admin"));
routeRoadRoute.post("/", createRoute);
routeRoadRoute.patch("/update/:id", updateRoute);
routeRoadRoute.patch("/status/:id", updateStatusRoute);

export default routeRoadRoute;
