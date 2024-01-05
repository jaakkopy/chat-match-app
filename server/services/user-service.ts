import {UserProfile} from '../models/user';
import query from '../db';

const getByEmail = async (email: string | undefined): Promise<UserProfile | null> => {
    if (!email)
        return null;
    try {
        const res = await query(
            "SELECT email FROM users WHERE email=$1",
            [email]
        );
        if (res.rows.length == 0)
            return null;
        return {
            email: res.rows[0].email
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
