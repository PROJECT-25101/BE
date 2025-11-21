import { Router } from "express";
import { getAllUser, getProfile } from "./user.controller.js";

const userRoute = Router();

userRoute.get("/private", getProfile);
userRoute.get("/", getAllUser);

export default userRoute;
