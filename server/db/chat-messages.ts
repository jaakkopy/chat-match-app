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


const getMessages = async (requesterEmail: string, targetUserEmail: string, batch: number): Promise<DBRows> => {
    return query(
        `WITH us(user1, user2) AS (VALUES(
            (SELECT id FROM users WHERE email=$1),
            (SELECT id FROM users WHERE email=$2)
         ))
         SELECT u.email as sender_email, date_sent, content FROM
             messages m
                 JOIN users u on u.id = m.sender,
             us
             WHERE
                 m.sender = us.user1 AND m.receiver = us.user2
                 OR
                 m.sender = us.user2 AND m.receiver = us.user1
             ORDER BY
                 "date_sent"
             OFFSET $3
             LIMIT 50;
        `,
        [requesterEmail, targetUserEmail, 50 * batch]
    );
}


const messages: DBMessages = {
    insertMessage,
    getMessages
}


export default messages;
