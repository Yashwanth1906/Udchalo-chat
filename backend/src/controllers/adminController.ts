import { PrismaClient } from "@prisma/client";
import { Request, Response,NextFunction } from "express"; // Import types for Express

const prisma = new PrismaClient();

export const signIn = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
         res.status(200).json({ success: true, message: "Signed in" });
    } catch (e) {
        console.error(e);
         next(e);
    }
};


interface CreateFlightRequest extends Request {
    body: {
        name: string;
        no: string;
        departure: Date;
        arrival: Date;
    };
}
export const createFlight = async (req: CreateFlightRequest, res: Response): Promise<void> => {
    try {
        console.log(req.body);
        const { name, no, departure, arrival } = req.body;
        const flight = await prisma.flight.create({
            data: {
                name: name,
                flightNo: no,
                departureDate: departure,
                arrivalDate: arrival
            }
        });
        res.json({ success: true, flight: flight });
    } catch (e) {
        console.error(e);
        res.json({ success: false, error: e });
    }
};
