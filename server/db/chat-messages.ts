import { DBMessages, DBRows } from '../models/db-interface';
import query from './pool';


// Add the given message to the database with the current timestamp (note: depends on the database time zone, which is set in init.sql)
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

// Get the messages sent between the two users.
// Returns the fields for the sender's email, the message timestamp and the message content
const getMessages = async (requesterEmail: string, targetUserEmail: string): Promise<DBRows> => {
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
        `,
        [requesterEmail, targetUserEmail]
    );
}


const messages: DBMessages = {
    insertMessage,
    getMessages
}


export default messages;