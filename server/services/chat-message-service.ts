import { 
    ServiceResult,
    defaultInvalidRequestResult,
    defaultInternalErrorResult,
    defaultServiceResult
} from '../models/service-result';
import { DB } from '../models/db-interface';


const getChatHistoryBatch = async (
    requesterEmail: string,
    targetUserEmail: string,
    batch: number,
    db: DB): Promise<ServiceResult> => {
    try {
        const chatHistory = await db.messages.getMessages(requesterEmail, targetUserEmail, batch);
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
