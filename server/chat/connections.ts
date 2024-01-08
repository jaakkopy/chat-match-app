import { WebSocket, RawData } from 'ws';
import ChatConnection from './chat-connection';

const connections: Map<WebSocket, ChatConnection> = new Map();

const setupNewConnection = (ws: WebSocket) => {
    connections.set(ws, new ChatConnection(ws));

    ws.on('message', (data: RawData) => {
        connections.get(ws)?.receiveMessage(data.toString());
    });

    ws.on('close', () => {
        console.log('Client has disconnected');
        connections.delete(ws);
    });
}


export default setupNewConnection;
