import { Router } from "express";
import  {createBooking, getFlight, loginuser}  from "../controllers/userController";
import { createUser } from "../controllers/userController";
export const userRouter = Router();
userRouter.get("/getflights", getFlight);
userRouter.post("/createuser",createUser);
userRouter.post("/createbooking",createBooking);
userRouter.post("/login",loginuser)

