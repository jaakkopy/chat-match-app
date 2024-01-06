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


const dbLikes: DBLikes = {
    insertLike,
    insertDislike
}

export default dbLikes;
