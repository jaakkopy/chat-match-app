import ServiceResult from '../models/service-result';
import {
    defaultInternalErrorResult,
    defaultServiceResult
} from './default-service-results';
import { DB } from '../models/db-interface';
import { OldChatMessage } from '../models/chat-interfaces';


const getChatHistoryBatch = async (
    requesterEmail: string,
    targetUserEmail: string,
    db: DB): Promise<ServiceResult> => {
    try {
        const chatHistory: OldChatMessage[] = (await db.messages.getMessages(requesterEmail, targetUserEmail)).map(m => {
            return {
                senderEmail: m.sender_email,
                content: m.content,
                dateSent: m.date_sent
            }
        });
        return defaultServiceResult(chatHistory);
    } catch (e) {
        console.error(e);
        return defaultInternalErrorResult();
    }
}


const chatService = {
    getChatHistoryBatch,
}

export default chatService;
