import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";
import userRoute from "./modules/user/user.routes.js";
import { authenticate } from "./common/middlewares/auth.middleware.js";
import { JWT_ACCESS_SECRET } from "./common/configs/environment.js";
import carRoute from "./modules/car/car.routes.js";
import seatRoute from "./modules/seat/seat.routes.js";
import routeRoadRoute from "./modules/route/route.routes.js";
import scheduleRoute from "./modules/schedule/schedule.routes.js";
import seatScheduleRoute from "./modules/seat-schedule/seat-schedule.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import paymentRouter from "./modules/payment/payment.routes.js";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/user", authenticate(JWT_ACCESS_SECRET), userRoute);
routes.use("/car", carRoute);
routes.use("/seat", seatRoute);
routes.use("/route", routeRoadRoute);
routes.use("/schedule", scheduleRoute);
routes.use("/seat-schedule", seatScheduleRoute);
routes.use("/order", orderRouter);
routes.use("/payment", paymentRouter);

export default routes;
