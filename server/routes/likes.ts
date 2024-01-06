import { Router, Request, Response } from 'express';
import { validationResult, body, matchedData } from 'express-validator';
import passport from 'passport';

import { ServiceResult } from '../models/service-result';
import likesService from '../services/likes-service';

const likesRouter = Router();

likesRouter.post("/like", [
    passport.authenticate("jwt", {session: false}),
    body('email').isEmail()
], async (req: Request, res: Response) => {

    const valRes = validationResult(req);
    if (!valRes.isEmpty())
        return res.status(400).json({errors: valRes.array()});

    try {
        const data = matchedData(req);
        // @ts-ignore : email exists for sure due to passport if we get here
        const likerEmail = req.user.email;
        const result: ServiceResult = await likesService.addLike(likerEmail, data.email);
        res.status(result.status).send(result.msg);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});

export default likesRouter;
