import { Router } from "express";
import { login, register, verifyUser } from "./auth.controller.js";

const authRoute = Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/verify/:token", verifyUser);

export default authRoute;
