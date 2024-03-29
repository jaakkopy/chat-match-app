import ServiceResult from '../models/service-result';
import {
    defaultInvalidRequestResult,
    defaultInternalErrorResult,
    defaultServiceResult
} from './default-service-results';
import { DB } from '../models/db-interface';
import { User } from '../models/user';


const addLike = async (likerEmail: string, likedEmail: string, db: DB): Promise<ServiceResult> => {
    /* 
     * NOTE:
     * The PostgreSQL trigger (defined in init.sql) will make sure that a user can't like and
     * dislike another user at the same time, so the existence of a dislike is not checked here (same with addDislike below)
     */ 
    try {
        await db.likes.insertLike(likerEmail, likedEmail);
        // If both users like each other, return an indication of this to the client.
        // This is used to know if the two users can start chatting right away
        const mutualLikes = await db.likes.verifyMutualLikes(likerEmail, likedEmail);
        return defaultServiceResult(mutualLikes);
    } catch (e) {
        if (db.errors.isUniqueConstraintError(e)) {
            return defaultInvalidRequestResult("User already liked");
        }
        else if (db.errors.isNullConstraintError(e)) {
            return defaultInvalidRequestResult("Either liker or liked does not exist");
        }
        console.error(e);
        return defaultInternalErrorResult();
    }
}

const addDislike = async (dislikerEmail: string, dislikedEmail: string, db: DB): Promise<ServiceResult> => {
    try {
        await db.likes.insertDislike(dislikerEmail, dislikedEmail);
    } catch (e) {
        if (db.errors.isUniqueConstraintError(e)) {
            return defaultInvalidRequestResult("User already disliked");
        }
        else if (db.errors.isNullConstraintError(e)) {
            return defaultInvalidRequestResult("Either disliker or disliked does not exist");
        }
        console.error(e);
        return defaultInternalErrorResult();
    } 
    return defaultServiceResult();
}


const getMatches = async (email: string, db: DB): Promise<ServiceResult> => {
    try {
        // Get matches (users with mutual likes) for this user
        const matches = await db.likes.getMatchesOfUser(email);
        const matchEmails: {profile: User, latestMessage: string}[] = matches.map(m => {
            if (m.email1 == email) {
                // If the first email corresponds to the requester, return the second one's info
                // This is done due to the slightly inconvenient sql query result (which works however)
                return {
                    profile: {
                        email: m.email2,
                        profiletext: m.pt2,
                        fullname: m.fn2,
                        birthdate: m.bd2
                    },
                    latestMessage: m.content
                }
            } else {
                return {
                    profile: {
                        email: m.email1,
                        profiletext: m.pt1,
                        fullname: m.fn1,
                        birthdate: m.bd1
                    },
                    latestMessage: m.content
                }
            }
        });
        return defaultServiceResult(matchEmails);
    } catch (e) {
        console.error(e);
        return defaultInternalErrorResult();
    }
}


const verifyMutualLikes = async (email1: string, email2: string, db: DB) => {
    try {
        const isMatch = await db.likes.verifyMutualLikes(email1, email2);
        return defaultServiceResult(isMatch);
    } catch (e) {
        return defaultInternalErrorResult();
    }
}


const likesService = {
    addLike,
    addDislike,
    getMatches,
    verifyMutualLikes
}

export default likesService;
