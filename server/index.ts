import dotenv from 'dotenv';
dotenv.config();

import express, {Express} from "express";
import authRouter from './routes/auth';


const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/auth', authRouter);


const PORT: number = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
