import { WebSocket } from 'ws';

import authService from '../services/auth-service';
import { ServiceResult } from '../models/service-result';
import getDB from '../db/db';
import { IChatMessage, IChatConnection, IChatNotifications } from '../models/chat-interfaces';

// A class which implements the "subject" and "observer" parts of the observer pattern.
// other IChatConnection objects register to this object to get copies of the message when
// the user that this object is responsible for is sending messages.
// The point is to allow for real time chatting if both participants of the chat are online.
class ChatConnection implements IChatConnection, IChatNotifications {
    ws: WebSocket;
    // undefined means unauthenticated
    userEmail: string | undefined;
    observingConnections: IChatConnection[];

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.observingConnections = [];
    }

    registerForMessages(connection: IChatConnection) {
        this.observingConnections.push(connection);
    }

    observeMessage(msg: IChatMessage) {
        this.ws.send(JSON.stringify(msg));
    }

    notifyObservers(msg: IChatMessage) {
        this.observingConnections.forEach(oc => oc.observeMessage(msg));
    }

    parseMessage(msg: string): IChatMessage | null {
        const asJson = JSON.parse(msg);
        if (!asJson?.senderEmail || !asJson?.receiverEmail || !asJson?.dateString || !asJson?.content)
            return null;
        return asJson;
    }

    async receiveMessage(msg: string) {
        if (this.userEmail) {
            const message = this.parseMessage(msg);
            if (!message) {
                this.ws.send("HTTP/1.1 400 Invalid message format\r\n\r\n");
            } else {
                this.notifyObservers(message);
            }
        } else {
            // The first message the client sends should contain just the token
            // The token is verified before the communication continues
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


export default ChatConnection;
