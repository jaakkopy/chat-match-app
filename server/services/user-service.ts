import {UserProfile} from '../models/user';
import { DB } from '../models/db-interface';

const getByEmail = async (email: string | undefined, db: DB): Promise<UserProfile | null> => {
    if (!email)
        return null;
    try {
        const rows = await db.query(
            "SELECT email FROM users WHERE email=$1",
            [email]
        );
        if (rows.length == 0)
            return null;
        return {
            email: rows[0].email
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}


const userService = {
    getByEmail
}

export default userService;
