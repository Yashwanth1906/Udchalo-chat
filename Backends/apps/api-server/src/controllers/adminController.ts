
import { Request, Response,NextFunction } from "express";
import prisma from "../../../../packages/db/src/index";

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
        flightNo: string;
        departureDate: Date;
        arrivalDate: Date;
    };
}
export const createFlight = async (req: CreateFlightRequest, res: Response): Promise<void> => {
    try {
        console.log(req.body);
        const { name, flightNo, departureDate, arrivalDate } = req.body;
        const flight = await prisma.flight.create({
            data: {
                name: name,
                flightNo: flightNo,
                departureDate: departureDate,
                arrivalDate: arrivalDate
            }
        });
        res.json({ success: true, flight: flight });
    } catch (e) {
        console.error(e);
        res.json({ success: false, error: e });
    }
};


export const createFlightRoom = async(req : Request,res : Response,next:NextFunction): Promise<void> =>{
    try{
        const {flightId,name} = req.body;
        const room = await prisma.flightRooms.create({
            data:{
                flightId : flightId,
                name : name
            }
        })
        res.json({success:true,message:"Succesfully added"});
    } catch(e) {
        console.log(e);
        res.json({success:false,message:e})
    }
}