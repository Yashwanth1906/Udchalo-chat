import { Router } from "express";
import { getFlight } from "../controllers/userController";

export const userRouter = Router();

userRouter.get("/getflights",getFlight);
