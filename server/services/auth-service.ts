import { Credentials } from '../models/auth-interfaces';
import { ServiceResult, defaultServiceResult } from '../models/service-result';
import { hash } from 'bcrypt';
import { DatabaseError } from 'pg';
import query from '../db';


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
        if (e instanceof DatabaseError && e.code == "22037") {
            result.status = 400;
            result.msg = "Credentials already taken";
        } else {
            result.status = 500;
            result.msg = "Internal server error";
        }
    }

    return result;
}


const authService = {
    register
}

export default authService;
