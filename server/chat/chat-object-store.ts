import { ChatObjectStore, ChatConnection } from '../models/chat-interfaces';

// Key = email, value = the object responsible for the connection
const chatObjectMap: Map<string, ChatConnection> = new Map();

const chatObjectStore: ChatObjectStore = {
    register: (email: string, connection: ChatConnection) => chatObjectMap.set(email, connection),
    unregister: (email: string) => chatObjectMap.delete(email),
    getRegisteredConnection: (email: string) => chatObjectMap.get(email)
}

export default chatObjectStore;
