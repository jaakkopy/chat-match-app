import { Credentials } from '../models/auth-interfaces';
import { 
    ServiceResult, 
    defaultServiceResult,
    defaultInternalErrorResult,
    defaultInvalidCredentialsResult
} from '../models/service-result';
import { hash, compare } from 'bcrypt';
import { DatabaseError } from 'pg';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import query from '../db';


// If the given email is not taken, hash the password and store the
// user's credentials in the db
const register = async (creds: Credentials): Promise<ServiceResult> => {
    let result: ServiceResult = defaultServiceResult();
    
    const hashedPw = await new Promise((resolve, reject) => {
        hash(creds.password, 10, (err, hashed) => {
            if (err)
                reject(err);
            resolve(hashed);
        })
    });

    try {
        await query(
            "INSERT INTO users(email, passwordhash) VALUES ($1, $2)",
            [creds.email, hashedPw]
        );
    } catch (e) {
        result.ok = false;
        // Unique key constraint error: https://www.postgresql.org/docs/current/errcodes-appendix.html
        if (e instanceof DatabaseError && e.code == "23505") {
            result.status = 400;
            result.msg = "Credentials already taken";
        } else {
            result = defaultInternalErrorResult();
        }
    }

    return result;
}


const login = async (creds: Credentials): Promise<ServiceResult> => {
    let result: ServiceResult = defaultServiceResult();
    let pwFromDb: string = '';
    // Fetch the hashed password from the database
    try {
        const res = await query(
            "SELECT passwordhash FROM users WHERE email=$1",
            [creds.email]
        );
        // No user with the given email exists
        if (res.rows.length == 0) {
            return defaultInvalidCredentialsResult();
        }
        pwFromDb = res.rows[0].passwordhash;
    } catch (e) {
        return defaultInternalErrorResult();
    }
     
    const isMatch = await compare(creds.password, pwFromDb);
    // Wrong password
    if (!isMatch) {
        return defaultInvalidCredentialsResult();
    }
    // Create a JWT
    const jwtPayload = {
        email: creds.email
    }
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    result.data = token;
    return result;
}


const authService = {
    register,
    login
}

export default authService;
