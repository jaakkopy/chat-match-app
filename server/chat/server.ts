import { WebSocketServer, Server, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import authService from '../services/auth-service';
import { ServiceResult } from '../models/service-result';
import getDB from '../db/db';


class ChatConnection {
    ws: WebSocket;
    // undefined means unauthenticated
    userEmail: string | undefined;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    async receiveMessage(msg: string) {
        if (this.userEmail) {
            this.ws.send(msg);
        } else {
            const result: ServiceResult = await authService.verifyJwt(msg, getDB());
            if (result.status != 200) {
                this.ws.send("HTTP/1.1 401 Unauthorized\r\n\r\n");
                this.ws.close();
            } else {
                this.userEmail = result.data;
            }
        }
    }
}


const connections: Map<WebSocket, ChatConnection> = new Map();


const setupWsServer = (server: HttpServer): Server => {
    const wss: Server = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log('New client connected')

        connections.set(ws, new ChatConnection(ws));

        ws.on('message', function message(data) {
            connections.get(ws)?.receiveMessage(data.toString());
        });
        ws.on('close', () => {
            console.log('Client has disconnected');
            connections.delete(ws);
        });
    });

    return wss;
}

export default setupWsServer;
