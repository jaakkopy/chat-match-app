import { WebSocket, RawData } from 'ws';
import ChatConn from './chat-connection';
import { ChatConnection } from '../models/chat-interfaces';

// Map the websocket to the chat connection object
const connections: Map<WebSocket, ChatConnection> = new Map();

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
