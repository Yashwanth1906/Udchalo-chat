import { Router } from "express";
import { createFlight, createFlightRoom, signIn } from "../controllers/adminController";

export const adminRouter = Router();

adminRouter.post("/signin", signIn);
adminRouter.post("/createFlight", createFlight);
adminRouter.post("/createroom",createFlightRoom);