import { IChatObjectStore, IChatConnection } from '../models/chat-interfaces';

// Key = email, value = the object responsible for the connection
const chatObjectMap: Map<string, IChatConnection> = new Map();

const chatObjectStore: IChatObjectStore = {
    register: (email: string, connection: IChatConnection) => chatObjectMap.set(email, connection),
    unregister: (email: string) => chatObjectMap.delete(email)
}

export default chatObjectStore;
