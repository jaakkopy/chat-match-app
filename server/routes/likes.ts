import { Router, Request, Response } from 'express';
import { validationResult, body, matchedData } from 'express-validator';
import passport from 'passport';

import ServiceResult from '../models/service-result';
import likesService from '../services/likes-service';
import getDB from '../db/db';

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
        const result: ServiceResult = await likesService.addLike(likerEmail, data.email, getDB());
        if (result.ok) {
            // Like successful. If both users like each other, mutualLikes is true
            return res.status(result.status).json({mutualLikes: result.data});
        }
        res.status(result.status).send(result.msg);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});


likesRouter.post("/dislike", [
    passport.authenticate("jwt", {session: false}),
    body('email').isEmail()
    ], async (req: Request, res: Response) => {

    const valRes = validationResult(req);
    if (!valRes.isEmpty())
        return res.status(400).json({errors: valRes.array()});

    try {
        const data = matchedData(req);
        // @ts-ignore : email exists for sure due to passport if we get here
        const dislikerEmail = req.user.email;
        const result: ServiceResult = await likesService.addDislike(dislikerEmail, data.email, getDB());
        res.status(result.status).send(result.msg);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});


likesRouter.get("/matches",
    passport.authenticate("jwt", {session: false}),
    async (req: Request, res: Response) => {
        try {
            // Get a list of users that the requester has liked, and which like the requester
            // @ts-ignore
            const result: ServiceResult = await likesService.getMatches(req.user.email, getDB());
            if (result.ok)
                return res.status(200).json({matches: result.data});
            return res.status(result.status).send(result.msg);
        } catch (e) {
            console.error(e);
            res.status(500).send("Internal server error");
        }
});


export default likesRouter;