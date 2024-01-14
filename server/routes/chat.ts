import { Router, Request, Response } from 'express';
import passport from 'passport';
import { ServiceResult } from '../models/service-result';
import getDB from '../db/db';
import chatService from '../services/chat-message-service';

const chatRouter = Router();

// Batch means a batch of 50 messages ordered from newest to oldest
// 0 => latest 50 messages, 1 => the 50 messages after the latest 50, etc
chatRouter.get("/history/:user/:batch",
    passport.authenticate("jwt", {session: false}),
    async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const requesterEmail: string = req.user.email;
        const targetUserEmail: string = req.params.user;
        const batchNum: number = Math.floor(Number(req.params.batch));
        if (isNaN(batchNum))
            return res.status(400).send("Batch is not a number");
        const result: ServiceResult = await chatService.getChatHistoryBatch(requesterEmail, targetUserEmail, batchNum, getDB());
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
