export interface ChatMessage {
    senderEmail: string;
    content: string;
}

export interface OldChatMessage {
    senderEmail: string;
    content: string;
    dateSent: string;
}

/*
The first chat message identifies the user via a jwt.
The receiver email is the user the requester wishes to chat with.
*/
export interface FirstChatMessage {
    jwt: string;
    receiverEmail: string;
}

export interface ChatConnection {
    // Receive a message written by the user associated with this websocket
    receiveMessageFromWs: (msg: string) => void;
    // Receive a message from another user. This writes the message to the websocket
    receiveMessageFromOther: (msg: ChatMessage) => void;
    cleanUpAfterConnectionClose: () => void;
}

// Represents a collection of open websocket connections
export interface ChatObjectStore {
    register: (email: string, connection: ChatConnection) => void;
    unregister: (email: string) => void;
    // If the user with the given email has a connection open, return the connection object associated with it
    getRegisteredConnection: (email: string) => ChatConnection | undefined;
}