import dotenv from 'dotenv';
dotenv.config();

import express, {Express, Request, Response} from "express";
import query from './db';


const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8000;

query("SELECT * FROM users;");

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
