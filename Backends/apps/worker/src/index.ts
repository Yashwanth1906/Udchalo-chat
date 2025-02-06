import redis from "../../../packages/db/redis/redisClient"
import prisma from "../../../packages/db/src/index"

enum MessageType {
    message = "message",
    announcement = "announcement",
}

async function main(){
    try{
        while(true){
            const res = await redis.rPop("message" as string)
            if(!res){
                continue;
            } else {
                const message = JSON.parse(res);
                console.log(message);
                const data = await prisma.messages.create({
                    data:{
                        type : message.type as MessageType,
                        flightRoomId: message.room,
                        userId : message.userId,
                        content : message.content,
                        timestamp : message.timestamp
                    }
                })
                console.log("succesfully done "+ data);
            }
        }
    } catch(e){
        console.log("Error")
        console.log(e)
    }
}

main();