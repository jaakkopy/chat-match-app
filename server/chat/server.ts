import { WebSocketServer, Server } from 'ws';
import { Server as HttpServer } from 'http';
import setupNewConnection from './connections';


const setupWsServer = (server: HttpServer): Server => {
    const wss: Server = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log('New client connected')
        setupNewConnection(ws);
    });

    return wss;
}

export default setupWsServer;
