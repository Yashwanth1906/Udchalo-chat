import redis from "../../../packages/db/redis/redisClient";
import prisma from "../../../packages/db/src/index";
import crypto from "crypto";

enum MessageType {
  message = "message",
  announcement = "announcement",
}
const hashContent = (content: string): string => {
  return crypto.createHash("sha256").update(content).digest("hex");
};

async function processMessage() {
  try {
    while (true) {
      const res = await redis.rPop("message");

      if (!res) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }

      try {
        const message = JSON.parse(res);
        const messageType: MessageType = Object.values(MessageType).includes(message.type)
          ? message.type as MessageType
          : MessageType.message;
        const hashedContent = hashContent(message.content);

        await prisma.messages.create({
          data: {
            type: messageType,
            flightRoomId: Number(message.room),
            userId: message.userId,
            content: hashedContent, // Store the hashed content
            timestamp: new Date(message.timestamp) // Ensure valid Date format
          }
        });

        console.log("Successfully inserted hashed message:", hashedContent);
      } catch (err) {
        console.error("Error parsing or inserting message:", err);
      }
    }
  } catch (e) {
    console.error("Fatal error in message processing:", e);
  }
}

processMessage();
