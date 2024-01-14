import { Router, Request, Response } from 'express';
import userService from '../services/user-service'; 
import passport from 'passport';
import { validationResult, body, matchedData } from 'express-validator';
import { UserProfileUpdateFields } from '../models/user';

import getDB from '../db/db';
import { ServiceResult } from '../models/service-result';

const userRouter = Router();

userRouter.get("/profile", passport.authenticate("jwt", {session: false}), async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const result: ServiceResult = await userService.getByEmail(req.user.email, getDB());
        if (result.ok) {
            return res.status(result.status).json({profile: result.data});
        }
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
});


userRouter.put("/profile",
    passport.authenticate("jwt", {session: false}),
    [body("profileText").exists()],
    async (req: Request, res: Response) => {

    console.log(req.body);
    const valRes = validationResult(req);
    if (!valRes.isEmpty())
        return res.status(400).json({errors: valRes.array()});

    try {
        const updateRequest: UserProfileUpdateFields = {profiletext: req.body.profileText};
        // @ts-ignore
        const result: ServiceResult = await userService.updateProfile(req.user.email, updateRequest, getDB())
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
});


// Get a certain amount of random user profiles, which are not liked or disliked, for browsing.
userRouter.get("/browse", passport.authenticate("jwt", {session: false}), async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const result: ServiceResult = await userService.getUsersForBrowsing(req.user.email, getDB());
        if (result.ok) {
            return res.status(result.status).json({users: result.data});
        }
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
});


export default userRouter;
