import query from './pool';
import { DBRows, DBUsers } from '../models/db-interface';

const insertUser = (
    email: string,
    hashedPw: string,
    fullname: string,
    birthdate: string
    ): Promise<DBRows> => {
    return query(
        `INSERT INTO users(email, fullname, birthdate, passwordhash)
            VALUES ($1, $2, $3, $4)
        `,
        [email, fullname, birthdate, hashedPw]
    );
}

const getUserByEmail = (email: string): Promise<DBRows> => {
    return query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
}

const getRandomUsersNotLikedOrDisliked = (email: string, amount: number): Promise<DBRows> => {
    return query(
        `SELECT email, profiletext, fullname, birthdate FROM users WHERE id NOT IN (
            SELECT liked FROM likes WHERE liker = (SELECT id FROM users WHERE email=$1)
            UNION
            SELECT disliked FROM dislikes WHERE disliker = (SELECT id FROM users WHERE email=$1)
        )
        AND email != $1
        LIMIT $2;
        `,
        [email, amount]
    );
}

const dbUsers: DBUsers = {
    insertUser,
    getUserByEmail,
    getRandomUsersNotLikedOrDisliked
}

export default dbUsers;
