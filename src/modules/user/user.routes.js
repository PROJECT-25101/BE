import { Router } from "express";
import {
  createUser,
  getAllUser,
  getProfile,
  updateUser,
} from "./user.controller.js";

const userRoute = Router();

userRoute.get("/private", getProfile);
userRoute.get("/", getAllUser);
userRoute.post("/", createUser);
userRoute.patch("/update/:id", updateUser);

export default userRoute;
