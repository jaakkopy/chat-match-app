import db from '../db';
import { DatabaseError } from 'pg';
import { 
    ServiceResult,
    defaultInvalidRequestResult,
    defaultInternalErrorResult,
    defaultServiceResult
} from '../models/service-result';


const alreadyExists = async (sourceEmail: string, targetEmail: string, isDislike: boolean): Promise<boolean> => {
    let text = `SELECT liker, liked FROM likes WHERE (
            liker=(SELECT id FROM users WHERE email=$1) 
            AND 
            liked=(SELECT id FROM users WHERE email=$2));`;
    if (isDislike) {
        text = `SELECT disliker, disliked FROM dislikes WHERE (
            disliker=(SELECT id FROM users WHERE email=$1) 
            AND 
            disliked=(SELECT id FROM users WHERE email=$2));`;
    }
    const res = await db.query(text, [sourceEmail, targetEmail]);
    return res.rows.length > 0;
}


const addLike = async (likerEmail: string, likedEmail: string): Promise<ServiceResult> => {
    /* 
     * NOTE:
     * The PostgreSQL trigger will make sure that a user can't like and
     * Dislike another user at the same time, so existence of a dislike is not checked here (same with dislike below)
     */ 

    try {
        // check if the like already exists
        if ( (await alreadyExists(likerEmail, likedEmail, false)) ) {
            return defaultInvalidRequestResult("Like already exists");
        }
        await db.query(
            `INSERT INTO likes (liker, liked) VALUES (
                (SELECT id FROM users WHERE email=$1),
                (SELECT id FROM users WHERE email=$2)
            );`,
            [likerEmail, likedEmail]
        );
    } catch (e) {
        // NOT NULL constraint violation (code 23502)
        if (e instanceof DatabaseError && e.code == '23502') {
            return defaultInvalidRequestResult("Either liker or liked does not exist");
        }
        console.error(e);
        return defaultInternalErrorResult();
    }
    return defaultServiceResult();
}

const addDislike = async (dislikerEmail: string, dislikedEmail: string): Promise<ServiceResult> => {
    try {
        // check if the dislike already exists
        if ( (await alreadyExists(dislikerEmail, dislikedEmail, true)) ) {
            return defaultInvalidRequestResult("dislike already exists");
        }
        await db.query(
            `INSERT INTO dislikes (disliker, disliked) VALUES (
                (SELECT id FROM users WHERE email=$1),
                (SELECT id FROM users WHERE email=$2)
            );`,
            [dislikerEmail, dislikedEmail]
        );
    } catch (e) {
        // NOT NULL constraint violation (code 23502)
        if (e instanceof DatabaseError && e.code == '23502') {
            return defaultInvalidRequestResult("Either disliker or disliked does not exist");
        }
        console.error(e);
        return defaultInternalErrorResult();
    } 
    return defaultServiceResult();
}



const likesService = {
    addLike,
    addDislike
}

export default likesService;
