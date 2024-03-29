import { Router, Request, Response } from 'express';
import userService from '../services/user-service'; 
import passport from 'passport';
import { validationResult, body } from 'express-validator';
import { UserProfileUpdateFields } from '../models/user';

import getDB from '../db/db';
import ServiceResult from '../models/service-result';

const userRouter = Router();

// A route for getting the user's profile information
userRouter.get("/profile", passport.authenticate("jwt", {session: false}), async (req: Request, res: Response) => {
    try {
        // Get the profile information of the requester
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


// A route for updating the profile
userRouter.put("/profile",
    passport.authenticate("jwt", {session: false}),
    [body("profileText").exists()],
    async (req: Request, res: Response) => {

    const valRes = validationResult(req);
    if (!valRes.isEmpty())
        return res.status(400).json({errors: valRes.array()});

    try {
        // Update the profile of the requester (currently just profile text supported)
        const updateRequest: UserProfileUpdateFields = {profiletext: req.body.profileText};
        // @ts-ignore
        const result: ServiceResult = await userService.updateProfile(req.user.email, updateRequest, getDB())
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
});


// A route for deleting the user's account
userRouter.delete("/", passport.authenticate("jwt", {session: false}), async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const result: ServiceResult = await userService.deleteAccount(req.user.email, getDB());
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
});


// Get a certain amount of user profiles, which are not liked or disliked, for browsing.
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