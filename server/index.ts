import app from './app';
import setupWsServer from './chat/server';

const PORT: number = Number(process.env.PORT) || 8000;

const server = app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

setupWsServer(server);
