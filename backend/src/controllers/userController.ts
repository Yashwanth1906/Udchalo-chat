import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getFlight = async (req: Request, res: Response): Promise<void> => {
    try {
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

const createBooking = async (req: CreateBookingRequest, res: Response): Promise<Response> => {
    try {
        const { flightId, userId } = req.body;
        const userBooking = await prisma.booking.create({
            data: {
                flightId : parseInt(flightId)
            }
        });

        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { bookingId: userBooking.id }
        });

        return res.json({ success: true, message: "Created Booking successfully" });
    } catch (e) {
        console.error(e);
        return res.json({ success: false, error: e });
    }
};

interface CreateUserRequest extends Request {
    body: {
        name: string;
        email: string;
        phoneNo: string;
        age: number;
        gender: string;
    };
}

const createUser = async (req: CreateUserRequest, res: Response): Promise<Response> => {
    try {
        const { name, email, phoneNo, age, gender } = req.body;
        const user = await prisma.user.create({
            data: {
                name :  name,
                email : email,
                phoneNo : phoneNo,
                age : JSON.stringify(age),
                gender : gender,
            }
        });
        return res.json({ success: true, user });
    } catch (e) {
        console.error(e);
        return res.json({ success: false, error: e });
    }
};

export default { getFlight, createUser, createBooking };