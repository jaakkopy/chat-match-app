export interface IChatMessage {
    dateString: string;
    content: string;
}

export interface IFirstChatMessage {
    jwt: string;
    receiverEmail: string;
}

export interface IChatConnection {
    receiveMessageFromWs: (msg: string) => void;
    receiveMessageFromOther: (msg: IChatMessage) => void;
    cleanUpAfterConnectionClose: () => void;
}

export interface IChatObjectStore {
    register: (email: string, connection: IChatConnection) => void;
    unregister: (email: string) => void;
    getRegisteredConnection: (email: string) => IChatConnection | undefined;
}
