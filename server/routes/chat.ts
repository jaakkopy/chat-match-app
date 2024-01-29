import { Router, Request, Response } from 'express';
import passport from 'passport';
import ServiceResult from '../models/service-result';
import getDB from '../db/db';
import chatService from '../services/chat-message-service';

const chatRouter = Router();

chatRouter.get("/history/:user",
    passport.authenticate("jwt", {session: false}),
    async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const requesterEmail: string = req.user.email;
        const targetUserEmail: string = req.params.user;
        // Get the past messages sent between the  two users (requester and target), and return them
        const result: ServiceResult = await chatService.getChatHistoryBatch(requesterEmail, targetUserEmail, getDB());
        if (result.ok) {
            return res.status(result.status).json({history: result.data});
        }
        return res.status(result.status).send(result.msg);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});

export default chatRouter;
