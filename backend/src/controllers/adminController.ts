import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const signIn = async(req,res) =>{
    try{
        return res.json({success:true,messsage:"Signed in"})
    } catch(e) {
        console.log(e);
        res.json({success:false,error : e});
    }
}


export const createFlight = async(req,res) =>{
    try{
        const {name,no,departure,arrival} = req.body;
        const flight = await prisma.flight.create({
            data:{
                name : name,
                flightNo : no,
                departureDate : departure,
                arrivalDate : arrival
            }
        })
        return res.json({success: true,flight : flight});
    } catch(e) {
        console.log(e);
        return res.json({success:false,error : e});
    }
}