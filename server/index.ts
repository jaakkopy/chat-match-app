import express, {Express, Request, Response} from "express";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8000;

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
