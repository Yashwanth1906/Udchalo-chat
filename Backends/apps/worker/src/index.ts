// import express from "express";
// import cors from 'cors';
// import redis from '../../../packages/db/redis/redisClient';
// import prisma from "../../../packages/db/src/index";

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.get("/test", async (req, res) => {
//     try {
//         const flights = await prisma.flight.findMany();
//         res.json({ success: true, flights });
//     } catch (e) {
//         console.error(e);
//         res.json({ success: false, error: e });
//     }
// });

// async function processMessages() {
//     while (true) {
//         console.log("Waiting for messages...");
//         const result = await redis.brPop(['chatQueue'], 0);
//         if (result) {
//             console.log("Received message:", result.element);
//         } else {
//             console.log("No messages in the queue");
//         }
//     }
// }
// (async () => {
//     await processMessages();
// })();

// app.listen(6969, () => {
//     console.log("Server running on port 6969");
// });
import redis from "../../../packages/db/redis/redisClient"
async function main(){
    try{
        while(true){
            const res = await redis.rPop("message" as string)
            if(!res){
                continue;
            } else {
                const message = JSON.parse(res);
                console.log(message);
            }
        }
    } catch(e){
        console.log("Error")
        console.log(e)
    }
}

main();