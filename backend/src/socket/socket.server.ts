import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { registerSocketEvents } from "./socket.event";
import { CLIENT_URL } from "../config/config";
import { socketAuthMiddleware } from "../middlewares/socket.middleware";

let io: Server;

export const initializeSocket = (
    httpServer: HttpServer
) : Server => {

    io = new Server(httpServer,
        {
            cors:{
                origin: CLIENT_URL,
                credentials: true
            }
        }
    );

    io.use(socketAuthMiddleware);

    io.on('connection', (socket) => {
        registerSocketEvents(socket);
    });

    return io;
};

export const getIo = () : Server => {

    if (!io) {
        throw new Error("Socket.IO is not been initialize");
    };

    return io;
}