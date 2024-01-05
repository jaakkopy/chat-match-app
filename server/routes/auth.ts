import { Router, Request, Response } from 'express';

const router = Router();

router.post("/register", (req: Request, res: Response) => {
    try {
        // TODO
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
});


export default router;
