import { Router } from "express";
import { signIn } from "../controllers/adminController";

export const adminRouter = Router();

adminRouter.post("/signin",signIn);