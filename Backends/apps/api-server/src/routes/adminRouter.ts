import { Router } from "express";
import { createFlight, signIn } from "../controllers/adminController";

export const adminRouter = Router();

adminRouter.post("/signin", signIn);
adminRouter.post("/createFlight", createFlight);