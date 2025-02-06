import { Router } from "express";
import { createFlight, createFlightRoom, getFligtRooms, signIn } from "../controllers/adminController";

export const adminRouter = Router();

adminRouter.post("/signin", signIn);
adminRouter.post("/createFlight", createFlight);
adminRouter.post("/createroom",createFlightRoom);
adminRouter.post("/getrooms",getFligtRooms);