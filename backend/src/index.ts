import "./jobs";
import http from 'http';
import { app } from './app';
import { PORT } from './config/config';
import { connectDB } from './config/database';
import { initializeSocket } from "./socket/socket.server";

const startServer = async () => {

    await connectDB();

    const httpServer = http.createServer(app);

    initializeSocket(httpServer);
    
    httpServer.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
};

startServer();