import { Router } from "express";
import { createFlight, createFlightRoom, getbookings, signIn } from "../controllers/adminController";

export const adminRouter = Router();
adminRouter.post("/signin", signIn);
adminRouter.post("/createFlight", createFlight);
adminRouter.post("/createroom",createFlightRoom);
adminRouter.get("/getBooking/:flightNo?",getbookings );
adminRouter.post("/getrooms",getFligtRooms);
