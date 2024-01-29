import {User, UserProfileUpdateFields} from '../models/user';
import { DB } from '../models/db-interface';
import ServiceResult from '../models/service-result';
import {
    defaultInternalErrorResult,
    defaultInvalidRequestResult,
    defaultServiceResult
} from './default-service-results';

// Get the user's information from the database by email
const getByEmail = async (email: string | undefined, db: DB): Promise<ServiceResult> => {
    if (!email)
        return defaultInvalidRequestResult("Not a valid email");
    try {
        const rows = await db.users.getUserByEmail(email);
        if (rows.length == 0)
            return defaultInvalidRequestResult("No such user exists");
        return defaultServiceResult({
            email: rows[0].email,
            profiletext: rows[0].profiletext,
            fullname: rows[0].fullname,
            birthdate: rows[0].birthdate.toLocaleDateString()
        });
    } catch (e) {
        console.error(e);
        return defaultInternalErrorResult();
    }
}


// Get information for 20 users which are not liked or disliked by the requester.
const getUsersForBrowsing = async (email: string, db: DB): Promise<ServiceResult> => {
    try {
        const amount = 20; // Get just 20 users per request to prevent possibly too large amounts from being transmitted
        const users: User[] = (await db.users.getUsersNotLikedOrDisliked(email, amount)).map(u => {
            return {
                email: u.email,
                profiletext: u.profiletext,
                fullname: u.fullname,
                birthdate: u.birthdate.toLocaleDateString()
            }
        });
        return defaultServiceResult(users)
    } catch (e) {
        return defaultInternalErrorResult();
    }
}


// Update the user's profile based on the given fields
const updateProfile = async (email: string, fields: UserProfileUpdateFields, db: DB): Promise<ServiceResult> => {
    try {
        await db.users.updateUserProfile(email, fields);
        return defaultServiceResult();
    } catch (e) {
        return defaultInternalErrorResult();
    }
}


const userService = {
    getByEmail,
    getUsersForBrowsing,
    updateProfile
}

export default userService;