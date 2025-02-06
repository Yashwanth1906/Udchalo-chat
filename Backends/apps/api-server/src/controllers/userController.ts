import { Request, Response,NextFunction } from "express";
import prisma from "../../../../packages/db/src/index";
import bcrypt from "bcrypt";

export const getFlight = async (req: Request, res: Response): Promise<void> => {
    console.log("Running");
    try {
        const flights = await prisma.flight.findMany();
        res.json({ success: true, flights });
    } catch (e) {
        console.error(e);
        res.json({ success: false, error: e });
    }
};

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

        res.json({ success: true, message: "Successfully added" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "User creation failed", error: e });
    }
};


export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { flightId, userId } = req.body;

        const [booking, userMapping] = await prisma.$transaction([
            prisma.booking.create({
                data: {
                    flightId: flightId
                }
            }),
            prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    bookingId: undefined
                }
            })
        ]);
        await prisma.user.update({
            where: { id: userId },
            data: { bookingId: booking.id }
        });

        res.json({ success: true, message: "Successfully booked and mapped" });

    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Booking failed", error: e });
    }
};


export default { getFlight};