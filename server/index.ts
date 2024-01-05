import dotenv from 'dotenv';
dotenv.config();

import express, {Express} from "express";
import authRouter from './routes/auth';
import userRouter from './routes/user';
import {initPassport} from './passport-config';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

initPassport();

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


const PORT: number = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
