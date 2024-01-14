import { WebSocket, RawData } from 'ws';
import ChatConn from './chat-connection';

const connections: Map<WebSocket, ChatConn> = new Map();

const setupNewConnection = (ws: WebSocket) => {
    connections.set(ws, new ChatConn(ws));

    ws.on('message', (data: RawData) => {
        connections.get(ws)?.receiveMessageFromWs(data.toString());
    });

    ws.on('close', () => {
        console.log("Client disconnected");
        connections.get(ws)?.cleanUpAfterConnectionClose();
        connections.delete(ws);
    });
}


export default setupNewConnection;
