import { Router } from "express";
import {
  createOrder,
  getAllOrder,
  getAllOrderByUser,
  getDetailOrder,
  updateOrder,
  updateStatusOrder,
} from "./order.controller.js";

const orderRouter = Router();

orderRouter.get("/", getAllOrder);
orderRouter.get("/:userId", getAllOrderByUser);
orderRouter.get("/detail/:id", getDetailOrder);
orderRouter.post("/create-payos", createOrder);
orderRouter.patch("/update/:id", updateOrder);
orderRouter.patch("/status/:id", updateStatusOrder);

export default orderRouter;
