import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getFlight = async(req,res) =>{
    try{
        const flights = await prisma.flight.findMany({});
        return res.json({success:true,flights : flights});
    } catch(e) {
        console.log(e);
        res.json({success:false,error:e});
    }
}

export const createBooking = async(req,res) =>{
    try{
        const {flightId,userId} = req.body;
        const userBooking  = await prisma.bookings.create({
            data:{
                flightId:flightId
            }
        });
        const user = await prisma.user.update({
            where:{
                id : userId
            },data:{
                bookingId:userBooking.id
            }
        });
        return res.json({success:true,message:"Created Booking successfully"});
    } catch(e) {
        console.log(e);
        return  res.json({success:false,error : e});
    }
}

export const createUser = async(req,res) =>{
    try{
        const {name,email,phoneNo,age,gender} = req.body;
        const users = await prisma.user.create({
            data:{
                name : name,
                email: email,
                phoneNo:phoneNo,
                age : age,
                gender: gender,
            }
        })
    } catch(e) {
        console.log(e);
        return res.json({success:false,error:e});
    }
}
