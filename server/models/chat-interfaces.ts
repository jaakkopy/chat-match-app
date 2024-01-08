export interface IChatMessage {
    senderEmail: string;
    receiverEmail: string;
    dateString: string;
    content: string;
}

export interface IChatConnection {
    receiveMessage: (msg: string) => void;
    observeMessage: (msg: IChatMessage) => void;
}

export interface IChatNotifications {
    registerForMessages: (connection: IChatConnection) => void;
    notifyObservers: (msg: IChatMessage) => void;
}
