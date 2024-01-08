import { DBMessages, DBRows } from '../models/db-interface';
import query from './pool';


const insertMessage = async (senderEmail: string, receiverEmail: string, content: string): Promise<DBRows> => {
    return query(
        `INSERT INTO messages (sender, receiver, content, date_sent) VALUES (
            (SELECT id FROM users WHERE email=$1),
            (SELECT id FROM users WHERE email=$2),
            $3,
            CURRENT_TIMESTAMP
        );`,
        [senderEmail, receiverEmail, content]
    );
}


const messages: DBMessages = {
    insertMessage
}


export default messages;
