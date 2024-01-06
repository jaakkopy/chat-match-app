import { 
    ServiceResult,
    defaultInvalidRequestResult,
    defaultInternalErrorResult,
    defaultServiceResult
} from '../models/service-result';
import { DB } from '../models/db-interface';


const alreadyExists = async (sourceEmail: string, targetEmail: string, isDislike: boolean, db: DB): Promise<boolean> => {
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
    const rows = await db.query(text, [sourceEmail, targetEmail]);
    return rows.length > 0;
}


const addLike = async (likerEmail: string, likedEmail: string, db: DB): Promise<ServiceResult> => {
    /* 
     * NOTE:
     * The PostgreSQL trigger will make sure that a user can't like and
     * dislike another user at the same time, so existence of a dislike is not checked here (same with dislike below)
     */ 

    try {
        // check if the like already exists
        if ( (await alreadyExists(likerEmail, likedEmail, false, db)) ) {
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
        if (db.errors.isNullConstraintError(e)) {
            return defaultInvalidRequestResult("Either liker or liked does not exist");
        }
        console.error(e);
        return defaultInternalErrorResult();
    }
    return defaultServiceResult();
}

const addDislike = async (dislikerEmail: string, dislikedEmail: string, db: DB): Promise<ServiceResult> => {
    try {
        // check if the dislike already exists
        if ( (await alreadyExists(dislikerEmail, dislikedEmail, true, db)) ) {
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
        if (db.errors.isNullConstraintError(e)) {
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
