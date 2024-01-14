import { DBLikes, DBRows } from '../models/db-interface';
import query from './pool';

const insertLike = async (likerEmail: string, likedEmail: string): Promise<DBRows> => {
    return query(
            `INSERT INTO likes (liker, liked) VALUES (
                (SELECT id FROM users WHERE email=$1),
                (SELECT id FROM users WHERE email=$2)
            );`,
            [likerEmail, likedEmail]
        );
}

const insertDislike = async (dislikerEmail: string, dislikedEmail: string): Promise<DBRows> => {
    return query(
            `INSERT INTO dislikes (disliker, disliked) VALUES (
                (SELECT id FROM users WHERE email=$1),
                (SELECT id FROM users WHERE email=$2)
            );`,
            [dislikerEmail, dislikedEmail]
        );
}

const getLikedUsersOfUser = async (email: string): Promise<DBRows> => {
    return query(
        `SELECT u.email FROM likes l 
            JOIN users u ON u.id = l.liked 
            WHERE l.liker = (SELECT id FROM users WHERE email=$1);
        `,
        [email]
    );
}

const getDislikedUsersOfUser = async (email: string): Promise<DBRows> => {
    return query(
        `SELECT u.email FROM dislikes l 
            JOIN users u ON u.id = l.disliked
            WHERE l.disliker = (SELECT id FROM users WHERE email=$1);
        `,
        [email]
    );
}

const verifyMutualLikes = async (email1: string, email2: string): Promise<boolean> => {
    // Do two separate calls for now
    const likesOf1 = await getLikedUsersOfUser(email1);
    const likesOf2 = await getLikedUsersOfUser(email2);
    return (likesOf2.find((x) => x.email == email1) != undefined) && (likesOf1.find((x) => x.email == email2) != undefined);
}

// This query returns user profiles for users who have liked each other ("matched"), and the latest message from their conversation
// The argument email will be either the liker or the liked depending on the grouping
const getMatchesOfUser = async (email: string): Promise<DBRows> => {
    return query(
        `SELECT u1.email AS email1,
                u1.profiletext as pt1,
                u1.fullname as fn1,
                u1.birthdate as bd1,
                u2.email AS email2,
                u2.profiletext as pt2,
                u2.fullname as fn2,
                u2.birthdate as bd2,
                m.content
        FROM (
            SELECT LEAST(liker, liked) AS user1,
                   GREATEST(liker, liked) AS user2
            FROM likes
            GROUP BY
                LEAST(liker, liked),
                GREATEST(liker, liked)
            HAVING count(*) = 2
        )
        JOIN users u1 ON
            u1.id = user1
        JOIN users u2 ON
            u2.id = user2
        JOIN messages m ON
            (m.sender = user1 AND m.receiver = user2)
            OR
            (m.sender = user2 AND m.receiver = user1)
        WHERE
            (u1.email = $1 OR u2.email = $1)
            AND
            m.date_sent = (SELECT MAX(date_sent) FROM (
                SELECT MAX(date_sent) AS date_sent
                FROM messages
                GROUP BY sender, receiver
                HAVING (sender = user1 AND receiver = user2) OR (sender = user2 AND receiver = user1)
            ))
            ;`,
        [email]
    );
}


const dbLikes: DBLikes = {
    insertLike,
    insertDislike,
    getLikedUsersOfUser,
    getDislikedUsersOfUser,
    verifyMutualLikes,
    getMatchesOfUser
}

export default dbLikes;
