import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./socket.room";
import { registerMessageHandlers } from "./socket.message";
import { registerReadHandlers } from "./socket.reads";

export const registerSocketEvents = (
    io: Server,
    socket : Socket
): void => {

    console.log(`socket connected ${socket.id}`);
    
    registerRoomHandlers(socket);

    registerMessageHandlers(io, socket);

    registerReadHandlers(io, socket);
}