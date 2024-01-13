import {IUser} from '../models/user';
import { DB } from '../models/db-interface';
import { defaultInternalErrorResult, defaultServiceResult } from '../models/service-result';

const getByEmail = async (email: string | undefined, db: DB): Promise<IUser | null> => {
    if (!email)
        return null;
    try {
        const rows = await db.users.getUserByEmail(email);
        if (rows.length == 0)
            return null;
        return {
            email: rows[0].email,
            profiletext: rows[0].profiletext,
            fullname: rows[0].fullname,
            birthdate: rows[0].birthdate
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}


const getUsersForBrowsing = async (email: string, db: DB) => {
    try {
        const amount = 20; // get 20 users
        let res = defaultServiceResult();
        const users: IUser[] = (await db.users.getRandomUsersNotLikedOrDisliked(email, amount)).map(u => {
            return {
                email: u.email,
                profiletext: u.profiletext,
                fullname: u.fullname,
                birthdate: u.birthdate.toLocaleDateString()
            }
        });
        res.data = users;
        return res;
    } catch (e) {
        return defaultInternalErrorResult();
    }
}


const userService = {
    getByEmail,
    getUsersForBrowsing
}

export default userService;
