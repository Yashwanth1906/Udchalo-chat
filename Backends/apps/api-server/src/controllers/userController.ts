import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import { Request, Response,NextFunction } from "express";
import prisma from "../../../../packages/db/src/index";
import { createtoken } from '..';
import moment from "moment";
import crypto from "crypto";
import redis from '../../../../packages/db/redis/redisClient';

dotenv.config()

export const userBookings = async(req : Request,res : Response) : Promise<void> =>{
    try {
        const {bookingId,flightId} = req.body;
        const passengers = await prisma.booking.findUnique({
            where:{
                id : bookingId,
                flightId : flightId
            }, select :{
                users : {
                    select :{
                        name : true,
                        age : true,
                        id : true,
                        gender : true
                    }
                }
            }
        })
        res.json({success : true,passengers});
    } catch(e) {
        console.log(e);
        res.json({success : false,message : e});
    }
}


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
    }
};


export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { flightId, emails } = req.body;

        if (!Array.isArray(emails) || emails.length === 0) {
            res.status(400).json({ success: false, message: "Invalid email list" });
        }
        const booking = await prisma.booking.create({
            data: { flightId: flightId }
        });
        await prisma.$transaction(
            emails.map((email : string) => 
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
    const passcomp= await bcrypt.compare(password,User.password)
    if (!passcomp){
        res.json({success:false,message:"password mismatch"})
        return
    }
    const token=createtoken(User.id)
    res.json({success:true,token:token})
    return 
}

// export const getAllBookings= async (req:Request,res:Response):Promise<void>=>{
//     const {userId}=req.body
//     try{
//         console.log("called");
//         const bookings = await prisma.user.findUnique({
//             where:{
//                 id : userId
//             },select :{
//                 booking : {
//                     select :{
//                         flight : {
//                             select : {
//                                 name : true,
//                                 flightNo : true,
//                                 departureDate : true,
//                                 arrivalDate : true
//                             }
//                         }
//                     }
//                 }
//             }
//         })
//         res.json({success:true,bookings});
//     } catch(e) {
//         console.log(e);
//         res.json({success:false,message : e})
//     }
// }

// export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
//     const { userId } = req.body;
//     try {
//         console.log("called");
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: userId
//             },
//             select: {
//                 booking: {
//                     select: {
//                         flight: {
//                             select: {
//                                 name: true,
//                                 flightNo: true,
//                                 departureDate: true,
//                                 arrivalDate: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//         if (!user || !user.booking) {
//             res.json({ success: false, message: "No bookings found" });
//             return;
//         }
//         const today = moment();
//         const bookings = Array.isArray(user.booking) ? user.booking.map((booking) => {
//             const { name, flightNo, departureDate, arrivalDate } = booking.flight;
//             const depDate = moment(departureDate);
//             const arrDate = moment(arrivalDate);

//             let status = "Upcoming";
//             if (arrDate.isBefore(today)) {
//                 status = "Completed";
//             }

//             return {
//                 flightName: name,
//                 flightNo,
//                 departureDate,
//                 arrivalDate,
//                 status
//             };
//         }) : [];
//         console.log(bookings);
//         res.json({ success: true, bookings });
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };


export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    try {
        console.log("called");
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                booking: {
                    select: {
                        flight: {
                            select: {
                                name: true,
                                flightNo: true,
                                departureDate: true,
                                arrivalDate: true
                            }
                        }
                    }
                }
            }
        });

        if (!user || !user.booking) {
            res.json({ success: false, message: "No bookings found" });
            return;
        }

        const today = moment();

        // Convert the Prisma result into an array
        const bookingsArray = Array.isArray(user.booking) ? user.booking : [user.booking];

        const bookings = bookingsArray.map((booking) => {
            const { name, flightNo, departureDate, arrivalDate } = booking.flight;
            const depDate = moment(departureDate);
            const arrDate = moment(arrivalDate);

            let status = "Upcoming";
            if (arrDate.isBefore(today)) {
                status = "Completed";
            }

            return {
                flightName: name,
                flightNo,
                departureDate,
                arrivalDate,
                status
            };
        });
        console.log(bookings);
        res.json({ success: true, bookings });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: e });
    }
};
export const syncMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const messages = req.body.messages;

        if (!Array.isArray(messages)) {
            res.status(400).json({ success: false, message: "Invalid messages format" });
            return;
        }

        for (const message of messages) {
            message.type = "message";
            redis.lPush("message", JSON.stringify(message))
            .then(() => console.log("Message successfully pushed to Redis"))
            .catch(err => console.error("Redis lPush failed:", err));
        }

        res.json({ success: true, message: "Messages synced successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: e });
    }
};

const SECRET_KEY = crypto.createHash("sha256").update("udchalo-chat").digest();
const decryptContent = (encryptedContent: string): string => {
  try {
    const [ivHex, encryptedText] = encryptedContent.split(":");

    if (!ivHex || !encryptedText) {
      throw new Error("Invalid encrypted content format");
    }

    const iv = Buffer.from(ivHex, "hex");

    if (iv.length !== 16) {
      throw new Error(`Invalid IV length: ${iv.length}, expected 16 bytes`);
    }

    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error : any) {
    console.error("Decryption error:", error.message);
    return "DECRYPTION_FAILED";
  }
};
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId }: { userId: number } = req.body;

    const messages = await prisma.messages.findMany({
      where: { userId: userId },
      select: { content: true },
    });

    const decryptedMessages = messages.map((msg) => ({
      content: decryptContent(msg.content),
    }));

    console.log(decryptedMessages);
    res.json({ success: true, messages: decryptedMessages });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e });
  }
};


export default { getFlight, createUser, createBooking};