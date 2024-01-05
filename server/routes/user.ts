import { Router, Request, Response } from 'express';
import passport from 'passport';

const userRouter = Router();

userRouter.get("/profile", passport.authenticate("jwt", {session: false}), (req: Request, res: Response) => {
    // TODO: implement further
    // @ts-ignore
    res.status(200).send(req.user.email);
});


export default userRouter;
