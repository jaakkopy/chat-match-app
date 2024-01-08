import { WebSocket } from 'ws';

import authService from '../services/auth-service';
import userService from '../services/user-service';
import { ServiceResult } from '../models/service-result';
import getDB from '../db/db';
import {
    IChatMessage,
    IChatConnection,
    IFirstChatMessage
} from '../models/chat-interfaces';
import chatObjectStore from './chat-object-store';

class ChatConnection implements IChatConnection {
    ws: WebSocket;
    // undefined means unauthenticated
    userEmail: string | undefined;
    receiverEmail: string | undefined;
    observingConnections: IChatConnection[];

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.observingConnections = [];
    }

    receiveMessageFromOther(msg: IChatMessage) {
        this.ws.send(JSON.stringify(msg));
    }

    parseFirstMessage(msg: string): IFirstChatMessage | null {
        const asJson = JSON.parse(msg);
        if (!asJson.jwt || !asJson.receiverEmail)
            return null;
        return asJson;
    }


    parseMessage(msg: string): IChatMessage | null {
        const asJson = JSON.parse(msg);
        if (!asJson?.dateString || !asJson?.content)
            return null;
        return asJson;
    }

    // Called on "close" event. Should be no need to call manually
    cleanUpAfterConnectionClose() {
        if (this.userEmail)
            chatObjectStore.unregister(this.userEmail);
    }
    
    async handleFirstMessage(msg: string) {
        // The first message the client sends should contain the token and the
        // receiver's email
        // The token is verified before the communication continues
        const parsed = this.parseFirstMessage(msg);
        if (!parsed) {
            this.ws.send("HTTP/1.1 400 Invalid request\r\n\r\n");
            this.ws.close();
            return;
        }
        // The first message's format was valid. Verify the token:
        const result: ServiceResult = await authService.verifyJwt(parsed.jwt, getDB());
        if (result.status != 200) {
            this.ws.send("HTTP/1.1 401 Unauthorized\r\n\r\n");
            this.ws.close();
        } else {
            this.userEmail = result.data;
            this.receiverEmail = parsed.receiverEmail;
            const checkForExistence = await userService.getByEmail(this.receiverEmail, getDB());
            if (!checkForExistence) {
                this.ws.send("HTTP/1.1 400 Receiver does not exists\r\n\r\n");
                this.ws.close();
                return;
            }
            if (this.userEmail) {
                chatObjectStore.register(this.userEmail, this);
            } else {
                this.ws.send("HTTP/1.1 401 Unauthorized\r\n\r\n");
                this.ws.close();
            }
        }
    }
    
    receiveMessageFromWs(msg: string) {
        if (this.userEmail) {
            const message = this.parseMessage(msg);
            if (!message) {
                this.ws.send("HTTP/1.1 400 Invalid message format\r\n\r\n");
            } else {
                // If the receiver is online, notify of the message
                // At this point the receiverEmail variable should not be undefined
                const receiver = chatObjectStore.getRegisteredConnection(this.receiverEmail!);
                if (receiver) {
                    receiver.receiveMessageFromOther(message);
                }
                // TODO: store message to database
            }
        } else {
            this.handleFirstMessage(msg);
        }
    }
}


export default ChatConnection;
