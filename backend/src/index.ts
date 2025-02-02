import express from 'express';
import { createServer } from 'http';
import { Server, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const wss = new Server({ server });

interface Message {
    type: 'message' | 'join' | 'leave' | 'history';
    room: string;
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
const clients = new Map<string, WebSocket>();

app.get('/', (req, res) => {
    res.send('WebSocket Chat Server');
});

wss.on('connection', (ws: WebSocket) => {
    console.log("Hello user connected");
    const clientId = uuidv4();
    clients.set(clientId, ws);
    let currentClientInfo: ClientInfo | null = null;

    console.log(`New client connected: ${clientId}`);

    ws.on('message', (data: string) => {
        try {
            const message: Message = JSON.parse(data);

            switch (message.type) {
                case 'join':
                    handleJoin(message, ws, clientId);
                    break;
                case 'message':
                    handleMessage(message, ws, clientId);
                    break;
                case 'leave':
                    handleLeave(message, ws, clientId);
                    break;
                default:
                    console.warn('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        if (currentClientInfo) {
            handleLeave({
                type: 'leave',
                room: currentClientInfo.room,
                username: currentClientInfo.username
            }, ws, clientId);
        }
        clients.delete(clientId);
    });

    function handleJoin(message: Message, ws: WebSocket, clientId: string) {
        console.log(message)
        if (!message.room || !message.username) {
            console.error('Invalid join message');
            return;
        }

        currentClientInfo = {
            username: message.username,
            room: message.room
        };

        if (!rooms.has(message.room)) {
            rooms.set(message.room, []);
        }

        const historyMessage: Message = {
            type: 'history',
            room: message.room,
            content: JSON.stringify(rooms.get(message.room))
        };

        ws.send(JSON.stringify(historyMessage));
        broadcastMessage(message.room, {
            type: 'join',
            room: message.room,
            username: message.username,
            content: `${message.username} joined the room`,
            timestamp: new Date()
        }, clientId);
    }

    function handleMessage(message: Message, ws: WebSocket, clientId: string) {
        if (!currentClientInfo || !message.content) return;

        const fullMessage: Message = {
            ...message,
            username: currentClientInfo.username,
            timestamp: new Date(),
            messageId: uuidv4()
        };
        rooms.get(currentClientInfo.room)?.push(fullMessage);
        broadcastMessage(currentClientInfo.room, fullMessage, clientId);
    }

    function handleLeave(message: Message, ws: WebSocket, clientId: string) {
        if (!currentClientInfo) return;

        const leaveMessage: Message = {
            type: 'leave',
            room: currentClientInfo.room,
            username: currentClientInfo.username,
            content: `${currentClientInfo.username} left the room`,
            timestamp: new Date()
        };

        broadcastMessage(currentClientInfo.room, leaveMessage, clientId);
        currentClientInfo = null;
    }

    function broadcastMessage(room: string, message: Message, senderId: string) {
        const roomMessages = rooms.get(room);
        if (roomMessages) {
            wss.clients.forEach(client => {
                if (client === clients.get(senderId)) return;
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});