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

const dbLikes: DBLikes = {
    insertLike,
    insertDislike,
    getLikedUsersOfUser,
    getDislikedUsersOfUser,
    verifyMutualLikes
}

export default dbLikes;
