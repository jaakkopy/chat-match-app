import { Credentials } from '../models/auth-interfaces';
import { 
    ServiceResult, 
    defaultServiceResult,
    defaultInternalErrorResult,
    defaultInvalidRequestResult
} from '../models/service-result';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DB } from '../models/db-interface';


// If the given email is not taken, hash the password and store the
// user's credentials in the db
const register = async (creds: Credentials, db: DB): Promise<ServiceResult> => {
    try {
        const hashedPw: string = await new Promise((resolve, reject) => {
            hash(creds.password, 10, (err, hashed) => {
                if (err)
                    reject(err);
                resolve(hashed);
            })
        });
        await db.users.insertUser(creds.email, hashedPw);
    } catch (e) {
        if (db.errors.isUniqueConstraintError(e)) {
            return defaultInvalidRequestResult("Credentials already taken");
        } else {
            return defaultInternalErrorResult();
        }
    }
    return defaultServiceResult();
}


const login = async (creds: Credentials, db: DB): Promise<ServiceResult> => {
    let invalidCredsResult = defaultInvalidRequestResult("Invalid credentials");
    let pwFromDb: string = '';
    // Fetch the hashed password from the database
    try {
        const rows = await db.users.getUserByEmail(creds.email);
        // No user with the given email exists
        if (rows.length == 0) {
            return invalidCredsResult;
        }
        pwFromDb = rows[0].passwordhash;
    } catch (e) {
        return defaultInternalErrorResult();
    }
    const isMatch = await compare(creds.password, pwFromDb);
    // Wrong password
    if (!isMatch) {
        return invalidCredsResult;
    }
    // Create a JWT
    const jwtPayload = {
        email: creds.email
    }
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    let result: ServiceResult = defaultServiceResult();
    result.data = token;
    return result;
}


const authService = {
    register,
    login
}

export default authService;
