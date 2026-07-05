import { Socket } from "socket.io";

export const registerSocketEvents = (socket : Socket): void => {

    console.log(`socket connected ${socket.id}`);
}