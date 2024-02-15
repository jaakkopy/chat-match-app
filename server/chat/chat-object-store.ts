import { ChatObjectStore, ChatConnection } from '../models/chat-interfaces';

// Key = email, value = the object responsible for the connection
const chatObjectMap: Map<string, ChatConnection> = new Map();

// Chat objects use this map to check if the target of the user's message is online
// if the target is online, they can give the other chat object, which is responsible for the target's connection, the message to write to the recipient's websocket
const chatObjectStore: ChatObjectStore = {
    register: (email: string, connection: ChatConnection) => chatObjectMap.set(email, connection),
    unregister: (email: string) => chatObjectMap.delete(email),
    getRegisteredConnection: (email: string) => chatObjectMap.get(email)
}

export default chatObjectStore;
