import query from './pool';
import { DBRows, DBUsers } from '../models/db-interface';
import { UserProfileUpdateFields } from '../models/user';

// Add a new user to the database
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

// Get a user's information by email
const getUserByEmail = (email: string): Promise<DBRows> => {
    return query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
}

// Get a certain amount of users that the requester has not liked or disliked
const getUsersNotLikedOrDisliked = (email: string, amount: number): Promise<DBRows> => {
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

// Update the requesters profile
const updateUserProfile = (email: string, fields: UserProfileUpdateFields): Promise<DBRows> => {
    return query(
        `UPDATE users SET profiletext=$1 WHERE email=$2`,
        [fields.profiletext, email]
    );
}

const dbUsers: DBUsers = {
    insertUser,
    getUserByEmail,
    getUsersNotLikedOrDisliked,
    updateUserProfile
}

export default dbUsers;