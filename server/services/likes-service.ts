import query from '../db';
import { DatabaseError } from 'pg';
import { 
    ServiceResult,
    defaultInvalidRequestResult,
    defaultInternalErrorResult,
    defaultServiceResult
} from '../models/service-result';


const addLike = async (likerEmail: string, likedEmail: string): Promise<ServiceResult> => {
    try {
        const alreadyExists = await query(
            `SELECT liker, liked FROM likes WHERE (
                liker=(SELECT id FROM users WHERE email=$1) 
                AND 
                liked=(SELECT id FROM users WHERE email=$2)
            );`,
            [likerEmail, likedEmail]
        );
        if (alreadyExists.rows.length != 0) {
            return defaultInvalidRequestResult("Like already exists");
        }
        await query(
            `INSERT INTO likes (liker, liked) VALUES (
                (SELECT id FROM users WHERE email=$1),
                (SELECT id FROM users WHERE email=$2)
            );`,
            [likerEmail, likedEmail]
        );
    } catch (e) {
        if (e instanceof DatabaseError && e.code == '23502') {
            return defaultInvalidRequestResult("Either liker or liked does not exist");
        }
        console.error(e);
        return defaultInternalErrorResult();
    }
    return defaultServiceResult();
}


const likesService = {
    addLike,
}

export default likesService;
