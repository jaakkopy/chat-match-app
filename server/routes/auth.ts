import { Router, Request, Response } from 'express';
import { validationResult, body, matchedData } from 'express-validator';
import authService from '../services/auth-service';
import { ServiceResult } from '../models/service-result';
import { Credentials } from '../models/auth-interfaces';
import getDB from '../db';

const authRouter = Router();

authRouter.post("/register", 
    [body('email').isEmail(), body('password').notEmpty()], 
    async (req: Request, res: Response) => {
    
    const valRes = validationResult(req);
    if (!valRes.isEmpty())
        return res.status(400).json({errors: valRes.array()});

    try {
        const data = matchedData(req);
        const credentials: Credentials = {email: data.email, password: data.password};
        const result: ServiceResult = await authService.register(credentials, getDB());
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
        const data = matchedData(req);
        const credentials: Credentials = {email: data.email, password: data.password};
        const result: ServiceResult = await authService.login(credentials, getDB());
        if (result.ok) {
            return res.status(result.status).json({token: result.data});
        }
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});


export default authRouter;
