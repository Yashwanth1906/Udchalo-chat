import  jwt  from 'jsonwebtoken';
import  dotenv  from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { userRouter } from './routes/userRouter';
import { adminRouter } from './routes/adminRouter';
import redis from '../../../packages/db/redis/redisClient';
import cors from 'cors';
import axios from 'axios';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
dotenv.config()
const JWT_SECRET="Yashdon"
export function createtoken(id:number)
{
    const token=jwt.sign({id},JWT_SECRET);
    return token
}
interface Message {
    type: 'message' | 'join' | 'leave' | 'history' | 'announcement';
    room: string;
    userId : number;
    username?: string;
    content?: string;
    timestamp?: Date;
    messageId?: string;
}

interface ClientInfo {
    username: string;
    room: string;
}

const rooms = new Map<string, Message[]>();
const clients = new Map<WebSocket, ClientInfo>();

wss.on('connection', (ws : WebSocket) => {
    console.log('New client connected');

    ws.on('message', (data) => {
        try {
            const message: Message = JSON.parse(data.toString());
            switch (message.type) {
                case 'join':
                    handleJoin(ws, message);
                    break;
                case 'message':
                    handleMessage(ws, message);
                    break;
                case 'leave':
                    handleLeave(ws,message);
                    break;
                case 'announcement':
                    handleMessage(ws,message);
                    break;
                default:
                    console.warn('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        handleLeave(ws);
        console.log('Client disconnected');
    });
});

function handleJoin(ws: WebSocket, message: Message) {
    if (!message.room || !message.username) {
        console.error('Invalid join message');
        return;
    }
    clients.set(ws, { username: message.username, room: message.room });
    if (!rooms.has(message.room)) {
        rooms.set(message.room, []);
    }
    const historyMessage: Message = {
        type: 'history',
        room: message.room,
        userId : message.userId,
        content: JSON.stringify(rooms.get(message.room))
    };
    ws.send(JSON.stringify(historyMessage));
    const joinMessage: Message = {
        type: 'join',
        userId : message.userId,
        room: message.room,
        username: message.username,
        content: `${message.username} joined the room`,
        timestamp: new Date()
    };
    broadcastMessage(message.room, joinMessage);
}

async function handleMessage(ws: WebSocket, message: Message) {
    const clientInfo = clients.get(ws);
    if (!clientInfo || !message.content) return;
    const fullMessage: Message = {
        type: message.type,
        userId : message.userId,
        room: clientInfo.room,
        username: clientInfo.username,
        content: message.content,
        timestamp: new Date(),
        messageId: uuidv4()
    };
    await axios.post("http://localhost:8000/predict-controversy/",{
        message : message.content
    }).then((res)=>{
        if(res.data.is_controversial) {
            fullMessage.content = "Inappropriate content."
        }
    })
    rooms.get(clientInfo.room)?.push(fullMessage);
    broadcastMessage(clientInfo.room, fullMessage);
    console.log(fullMessage);
    redis.lPush("message", JSON.stringify(fullMessage))
        .then(() => console.log("Message successfully pushed to Redis"))
        .catch(err => console.error("Redis lPush failed:", err));
}

function handleLeave(ws: WebSocket,message? : Message) {
    const clientInfo = clients.get(ws);
    if (!clientInfo) return;
    
    const leaveMessage: Message = {
        type: 'leave',
        userId : message?.userId ||  -1,
        room: clientInfo.room,
        username: clientInfo.username,
        content: `${clientInfo.username} left the room`,
        timestamp: new Date()
    };
    broadcastMessage(clientInfo.room, leaveMessage);
    clients.delete(ws);
}

function broadcastMessage(room: string, message: Message) {
    wss.clients.forEach((client) => {
        const clientInfo = clients.get(client);
        if (client.readyState === WebSocket.OPEN && clientInfo?.room === room) {
            client.send(JSON.stringify(message));
        }
    });
}

app.get('/', (req, res) => {
    res.send('WebSocket Chat Server');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
