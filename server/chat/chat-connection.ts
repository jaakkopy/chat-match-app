import { WebSocket } from 'ws';

import authService from '../services/auth-service';
import userService from '../services/user-service';
import { ServiceResult } from '../models/service-result';
import getDB from '../db/db';
import {
    ChatMessage,
    ChatConnection,
    FirstChatMessage
} from '../models/chat-interfaces';
import chatObjectStore from './chat-object-store';

/* Parts of the websocket code were inspired by:
 *  - https://ably.com/blog/websocket-authentication
 *  - https://ably.com/blog/web-app-websockets-nodejs 
 */


class ChatConn implements ChatConnection {
    ws: WebSocket;
    // undefined means unauthenticated
    userEmail: string | undefined;
    receiverEmail: string | undefined;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    parseFirstMessage(msg: string): FirstChatMessage | null {
        const asJson = JSON.parse(msg);
        if (!asJson.jwt || !asJson.receiverEmail)
            return null;
        return asJson;
    }

    parseMessage(msg: string): ChatMessage | null {
        let asJson = JSON.parse(msg);
        if (!asJson.senderEmail || !asJson?.content)
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
        // The token and the emails are verified before the communication continues
        const parsed = this.parseFirstMessage(msg);
        if (!parsed) {
            this.ws.send("HTTP/1.1 400 Invalid request\r\n\r\n");
            this.ws.close();
            return;
        }
        // The first message's format was valid. Verify the token:
        const result: ServiceResult = await authService.verifyJwt(parsed.jwt, getDB());
        if (result.status != 200) {
            this.ws.send("HTTP/1.1 401 Invalid token\r\n\r\n");
            this.ws.close();
        } else {
            this.userEmail = result.data;
            this.receiverEmail = parsed.receiverEmail;
            // verify that the receiver exists
            const checkForExistence: ServiceResult = await userService.getByEmail(this.receiverEmail, getDB());
            if (!checkForExistence.ok) {
                this.ws.send("HTTP/1.1 400 Receiver does not exists\r\n\r\n");
                this.ws.close();
                return;
            }
            if (this.userEmail) {
                // Verify that both users have liked each other: otherwise communication is not allowed
                const bothLike = await getDB().likes.verifyMutualLikes(this.userEmail, this.receiverEmail);
                if (!bothLike) {
                    this.ws.send("HTTP/1.1 401 Users not liked\r\n\r\n");
                    this.ws.close();
                    return;
                }
                chatObjectStore.register(this.userEmail, this);
                console.log(this.userEmail, "registered for chatting");
            } else {
                this.ws.send("HTTP/1.1 401 Nonexistent email\r\n\r\n");
                this.ws.close();
            }
        }
    }

    receiveMessageFromOther(msg: ChatMessage) {
        console.log(this.userEmail, "received message from other:", msg.senderEmail);
        this.ws.send(JSON.stringify(msg));
    }

    receiveMessageFromWs(msg: string) {
        if (this.userEmail) {
            const message: ChatMessage | null = this.parseMessage(msg);
            if (!message) {
                this.ws.send("HTTP/1.1 400 Invalid message format\r\n\r\n");
            } else {
                console.log(this.userEmail, "received message from ws");
                // If the receiver is online, notify of the message
                // At this point the receiverEmail variable should not be undefined
                const receiver = chatObjectStore.getRegisteredConnection(this.receiverEmail!);
                if (receiver) {
                    receiver.receiveMessageFromOther(message);
                }
                // store the message
                getDB().messages.insertMessage(this.userEmail, this.receiverEmail!, message.content);
            }
        } else {
            this.handleFirstMessage(msg);
        }
    }
}


export default ChatConn;
