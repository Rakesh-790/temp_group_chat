import { Socket } from "socket.io";

export const registerSocketEvents = (socket : Socket): void => {

    console.log(`socket connected ${socket.id}`);

    socket.on("disconnect", (reason) => {
        console.log(
            `Socket Disconnected: ${socket.id} (${reason})`
        );
    });
}