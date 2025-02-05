import express from "express"
import cors from 'cors';
import redis from './redisClient';
import { PrismaClient } from '@prisma/client';

const URL = process.env.DATABASE_URL

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: URL
        }
    }
});


const app = express();
app.use(express.json());
app.use(cors());

app.get("/test",async(req,res)=>{
    try {
        const flights = await prisma.flight.findMany();
        res.json({ success: true, flights });
    } catch (e) {
        console.error(e);
        res.json({ success: false, error: e });
    }
})

app.listen(6969,()=>{
    console.log("running");
})