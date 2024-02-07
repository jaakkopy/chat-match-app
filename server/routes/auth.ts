import { Router, Request, Response } from 'express';
import { validationResult, body, matchedData } from 'express-validator';
import authService from '../services/auth-service';
import ServiceResult from '../models/service-result';
import { Credentials, RegistrationFields } from '../models/auth-interfaces';
import getDB from '../db/db';

const authRouter = Router();

authRouter.post("/register", 
    [
        body('email').isEmail(),
        body('password').notEmpty(),
        body('fullname').notEmpty(),
        body('birthdate').isDate({format: "yyyy-mm-dd"}),
        body('birthdate').toDate().custom((_, { req }) => {
            let eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            if (eighteenYearsAgo < req.body.birthdate.getTime())
                throw new Error('Must be at least 18 years old');
            return true;
        })
    ], 
    async (req: Request, res: Response) => {
    
    // Check that the fields are ok
    const valRes = validationResult(req);
    if (!valRes.isEmpty())
        return res.status(400).json({errors: valRes.array()});

    try {
        const data = matchedData(req);
        const fields: RegistrationFields = {
            email: data.email,
            password: data.password,
            fullname: data.fullname,
            birthdate: data.birthdate
        };
        // Register the new user.
        const result: ServiceResult = await authService.register(fields, getDB());
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});


authRouter.post("/login",
    [body('email').isEmail(), body('password').notEmpty()], 
    async (req: Request, res: Response) => {
    
    const valRes = validationResult(req);
    if (!valRes.isEmpty())
        return res.status(400).json({errors: valRes.array()});
    
    try {
        // Try to login the user. If the credentials are correct, return a JWT
        const data = matchedData(req);
        const credentials: Credentials = {email: data.email, password: data.password};
        const result: ServiceResult = await authService.login(credentials, getDB());
        if (result.ok) {
            return res.status(result.status).json({token: result.data});
        }
        return res.status(result.status).json({errors: [{path: 'error', msg: result.msg}]});
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});


export default authRouter;
