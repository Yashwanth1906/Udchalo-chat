import { Router } from "express";
import  {createBooking, getAllBookings, getFlight, getMessages, loginuser, syncMessages, userBookings}  from "../controllers/userController";
import { createUser } from "../controllers/userController";
export const userRouter = Router();
userRouter.get("/getflights", getFlight);
userRouter.post("/createuser",createUser);
userRouter.post("/createbooking",createBooking);
userRouter.post("/login",loginuser);
userRouter.post("/getbooking",userBookings);
userRouter.post("/getAllbookings",getAllBookings);
userRouter.post("/syncmessages",syncMessages);
userRouter.post("/getmessages",getMessages);