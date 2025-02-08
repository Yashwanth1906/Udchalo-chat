// import crypto from "crypto";
// import redis from "../../../packages/db/redis/redisClient";
// import prisma from "../../../packages/db/src/index";

// enum MessageType {
//   message = "message",
//   announcement = "announcement",
// }

// const SECRET_KEY = "udchalo-chat"; 
// const IV_LENGTH = 16;

// const encryptContent = (content: string): string => {
//   const iv = crypto.randomBytes(IV_LENGTH);
//   const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
//   let encrypted = cipher.update(content, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return iv.toString("hex") + ":" + encrypted;
// };

// async function processMessage() {
//   try {
//     while (true) {
//       const res = await redis.rPop("message");

//       if (!res) {
//         await new Promise((resolve) => setTimeout(resolve, 100));
//         continue;
//       }

//       try {
//         const message = JSON.parse(res);
//         const messageType: MessageType = Object.values(MessageType).includes(message.type)
//           ? message.type as MessageType
//           : MessageType.message;
//         const encryptedContent = encryptContent(message.content);

//         await prisma.messages.create({
//           data: {
//             type: messageType,
//             flightRoomId: Number(message.room),
//             userId: message.userId,
//             content: encryptedContent,
//             timestamp: new Date(message.timestamp),
//           },
//         });

//         console.log("Successfully inserted encrypted message.");
//       } catch (err) {
//         console.error("Error parsing or inserting message:", err);
//       }
//     }
//   } catch (e) {
//     console.error("Fatal error in message processing:", e);
//   }
// }

// processMessage();

import crypto from "crypto";
import redis from "../../../packages/db/redis/redisClient";
import prisma from "../../../packages/db/src/index";

enum MessageType {
  message = "message",
  announcement = "announcement",
}

const SECRET_KEY = crypto.createHash("sha256").update("udchalo-chat").digest();

const encryptContent = (content: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);
  let encrypted = cipher.update(content, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
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
          ? (message.type as MessageType)
          : MessageType.message;

        const encryptedContent = encryptContent(message.content); // Encrypt content

        await prisma.messages.create({
          data: {
            type: messageType,
            flightRoomId: Number(message.room),
            userId: message.userId,
            content: encryptedContent, // Store encrypted content
            timestamp: new Date(message.timestamp), // Ensure valid Date format
          },
        });

        console.log("Successfully inserted encrypted message:", encryptedContent);
      } catch (err) {
        console.error("Error parsing or inserting message:", err);
      }
    }
  } catch (e) {
    console.error("Fatal error in message processing:", e);
  }
}

processMessage();
