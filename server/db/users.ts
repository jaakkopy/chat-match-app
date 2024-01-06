import query from './pool';
import { DBRows, DBUsers } from '../models/db-interface';

const insertUser = (email: string, hashedPw: string): Promise<DBRows> => {
    return query(
        "INSERT INTO users(email, passwordhash) VALUES ($1, $2)",
        [email, hashedPw]
    );
}

const getUserByEmail = (email: string): Promise<DBRows> => {
    return query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
}

const dbUsers: DBUsers = {
    insertUser,
    getUserByEmail
}

export default dbUsers;
