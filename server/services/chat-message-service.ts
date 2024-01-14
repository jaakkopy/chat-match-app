import { 
    ServiceResult,
    defaultInvalidRequestResult,
    defaultInternalErrorResult,
    defaultServiceResult
} from '../models/service-result';
import { DB } from '../models/db-interface';
import { OldChatMessage } from '../models/chat-interfaces';


const getChatHistoryBatch = async (
    requesterEmail: string,
    targetUserEmail: string,
    batch: number,
    db: DB): Promise<ServiceResult> => {
    try {
        const chatHistory: OldChatMessage[] = (await db.messages.getMessages(requesterEmail, targetUserEmail, batch)).map(m => {
            return {
                senderEmail: m.sender_email,
                content: m.content,
                dateSent: m.date_sent
            }
        });
        let res = defaultServiceResult();
        res.data = chatHistory;
        return res;
    } catch (e) {
        console.error(e);
        return defaultInternalErrorResult();
    }
}


const chatService = {
    getChatHistoryBatch,
}

export default chatService;
