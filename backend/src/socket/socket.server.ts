import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { registerSocketEvents } from "./socket.event";
import { CLIENT_URL } from "../config/config";
import { socketAuthMiddleware } from "../middlewares/socket.middleware";
import { socketManager } from "./socket.manager";

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
        const userId = socket.data.user.id;

        socketManager.registerSocket(userId, socket);

        registerSocketEvents(socket);

        socket.on('disconnect', (reason) => {
            socketManager.removeSocket(userId, socket);

            console.log(
                `Socket Disconnected: ${socket.id} (${reason})`
            );
        });
    });

    return io;
};

export const getIo = () : Server => {

    if (!io) {
        throw new Error("Socket.IO is not been initialize");
    };

    return io;
};