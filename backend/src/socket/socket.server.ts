import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { registerSocketEvents } from "./socket.event";
import { CLIENT_URL } from "../config/config";
import { socketAuthMiddleware } from "../middlewares/socket.middleware";
import { socketManager } from "./socket.manager";
import { registerRoomHandlers } from "./socket.room";
import { handleUserConnected, handleUserDisconnected } from "../modules/presence/user.presence";
import { registerMessageHandlers } from "./socket.message";

let io: Server;

export const initializeSocket = (
    httpServer: HttpServer
): Server => {

    io = new Server(httpServer,
        {
            cors: {
                origin: CLIENT_URL,
                credentials: true
            }
        }
    );

    io.use(socketAuthMiddleware);

    io.on("connection", async (socket) => {
        try {
            const userId = socket.data.user.id;

            socketManager.registerSocket(userId, socket);

            await handleUserConnected(userId, io);

            registerSocketEvents(io, socket);

            socket.on("disconnect", async (reason) => {
                try {
                    socketManager.removeSocket(userId, socket);

                    await handleUserDisconnected(userId, io);

                    console.log(`Socket Disconnected: ${socket.id} (${reason})`);
                } catch (error) {
                    console.error("Presence disconnect error:", error);
                }
            });
        } catch (error) {
            console.error("Presence connection error:", error);
            socket.disconnect(true);
        }
    });

    return io;
};

export const getIo = (): Server => {

    if (!io) {
        throw new Error("Socket.IO is not been initialize");
    };

    return io;
};