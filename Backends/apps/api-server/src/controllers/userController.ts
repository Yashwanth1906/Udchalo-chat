import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Flight } from './../../../../node_modules/.prisma/client/index.d';
import { Request, Response,NextFunction } from "express";
import prisma from "../../../../packages/db/src/index";
import { createtoken } from '..';

dotenv.config()
export const getFlight = async (req: Request, res: Response): Promise<void> => {
    console.log("Running");
    try {
        const id = req.params.id;
        if (id){
            const flight = await prisma.flight.findUnique({
                where: {
                    flightNo: id
                }
            });
            if (!flight){
                res.json({ success: false, message: "Flight not found" });
                return;
            }
            res.json({ success: true, flight });
            return;
        }
        const flights = await prisma.flight.findMany();
        res.json({ success: true, flights });
    } catch (e) {
        console.error(e);
        res.json({ success: false, error: e });
    }
};


interface CreateBookingRequest extends Request {
    body: {
        flightId: string;
        userId: string;
    };
}

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, phoneNo, age, gender, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phoneNo,
                age,
                gender,
                password : hashedPassword
            }
        });

        res.json({ success: true, message: "Created User successfully" });
        return;
        
    } catch (e) {
        console.error(e);
        res.json({ success: false, error: e });
        return;
        res.status(500).json({ success: false, message: "User creation failed", error: e });
    }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { flightId, emails } = req.body;
        if (!flightId || !Array.isArray(emails) || emails.length === 0) {
            res.status(400).json({ success: false, message: "Invalid input data" });
            return;
        }
        const booking = await prisma.booking.create({
            data: { flightId }
        });
        await prisma.$transaction(
            emails.map(email => 
                prisma.user.update({
                    where: { email },
                    data: { bookingId: booking.id }
                })
            )
        );
        res.json({ success: true, message: "Successfully booked and mapped", bookingId: booking.id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Booking failed", error: e });
    }
};

interface loginPass extends Request {
    body:{
        email:string,
        password:string
    }
}

export const loginuser= async (req:loginPass,res:Response):Promise<void>=>{
    const {email,password}=req.body

    const User= await prisma.user.findUnique(
        {where:{email:email}}
    )
    if(!User){
        res.json({success:false,message:"no User found"})
        return 
    }
    const passcomp= await bcrypt.compare(password,User.password);
    if (!passcomp){
        res.json({success:false,message:"password mismatch"})
        return
    }
    const token=createtoken(User.id)
    res.json({success:true,token:token})
    return 
}


interface loginPass extends Request {
    body:{
        email:string,
        password:string
    }
}

interface bookingId extends Request {
    body : {
        bookingId : string;
        flightId : string;
    }
}

export const getBookingsWithId= async (req:bookingId,res:Response):Promise<void>=>{
    try{
        const {bookingId,flightId} = req.body;
        const passengers = await prisma.booking.findUnique({
            where:{
                id : bookingId,
                flightId : flightId
            }, select:{
                users : {
                    select:{
                        name: true,
                        age:true,
                        gender:true,
                        id : true
                    }
                }
            }
        })
        res.json({success : true,passengers});
    } catch(e) {
        console.log(e);
        res.json({success:false,message:e});
    }
}
export default { getFlight, createUser, createBooking};