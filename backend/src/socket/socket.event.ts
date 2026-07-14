import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./socket.room";
import { registerMessageHandlers } from "./socket.message";

export const registerSocketEvents = (
    io: Server,
    socket : Socket
): void => {

    console.log(`socket connected ${socket.id}`);
    
    registerRoomHandlers(socket);

    registerMessageHandlers(io, socket);
}