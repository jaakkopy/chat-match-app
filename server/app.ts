import dotenv from 'dotenv';

// Load the correct environment variables
if (process.env.NODE_ENV == 'test') {
    dotenv.config({path: '.env.test'});
} else {
    dotenv.config();
}

import express, {Express} from "express";
import authRouter from './routes/auth';
import userRouter from './routes/user';
import likesRouter from './routes/likes';
import chatRouter from './routes/chat';
import {initPassport} from './passport-config';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

initPassport();

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/likes', likesRouter);
app.use('/api/chat', chatRouter);

export default app;
