import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./socket.room";
import { registerMessageHandlers } from "./socket.message";
import { registerReadHandlers } from "./socket.reads";
import { registerDeliveryHandlers } from "./socket.delivery";

export const registerSocketEvents = (
    io: Server,
    socket : Socket
): void => {
    
    registerRoomHandlers(socket);

    registerMessageHandlers(io, socket);

    registerReadHandlers(io, socket);

    registerDeliveryHandlers(socket);
}