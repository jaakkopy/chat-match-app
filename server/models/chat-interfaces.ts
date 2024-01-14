export interface ChatMessage {
    senderEmail: string;
    content: string;
}

export interface OldChatMessage {
    senderEmail: string;
    content: string;
    dateSent: string;
}

export interface FirstChatMessage {
    jwt: string;
    receiverEmail: string;
}

export interface ChatConnection {
    receiveMessageFromWs: (msg: string) => void;
    receiveMessageFromOther: (msg: ChatMessage) => void;
    cleanUpAfterConnectionClose: () => void;
}

export interface ChatObjectStore {
    register: (email: string, connection: ChatConnection) => void;
    unregister: (email: string) => void;
    getRegisteredConnection: (email: string) => ChatConnection | undefined;
}