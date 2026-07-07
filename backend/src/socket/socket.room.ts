import { Socket } from "socket.io";

export const registerRoomHandlers = (
    socket: Socket
) : void => {

    socket.on('room:join', (roomId: string) => {
        socket.join(roomId);

        console.log(`${socket.id} joined ${roomId}`);

        console.log("Rooms:", [...socket.rooms]);
    });

    socket.on('room:leave', (roomId: string) => {
        socket.join(roomId);

        console.log(`${socket.id} leave ${roomId}`);

        console.log("Rooms:", [...socket.rooms]);
    });
};