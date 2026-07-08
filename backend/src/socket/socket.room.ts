import { Socket } from "socket.io";
import { ensureUserIsMember, getGroupById } from "../modules/groups/group.service";
import { joinRoomSchema, leaveRoomSchema } from "./socket.validation";
import { handleSocketError } from "./socket.error";

export const registerRoomHandlers = (
    socket: Socket
): void => {

    socket.on('room:join', async (payload, callback?: (response: {
        success: boolean;
        message: string;
    }) => void) => {
        try {
            const { roomId } = joinRoomSchema.parse(payload);

            const userId = socket.data.user.id;

            const group = await getGroupById(roomId);

            ensureUserIsMember(group, userId);

            socket.join(roomId);

            console.log(`${socket.id} joined ${roomId}`);

            console.log("Rooms:", [...socket.rooms]);

            callback?.({
                success: true,
                message: "Joined room successfully."
            });

        } catch (error: any) {
            handleSocketError(error, callback);
        };
    });

    socket.on('room:leave', (payload, callback?: (response: {
        success: boolean;
        message: string;
    }) => void) => {
        try {
            const { roomId } = leaveRoomSchema.parse(payload);

            socket.leave(roomId);

            console.log(`${socket.id} left ${roomId}`);

            console.log("Rooms:", [...socket.rooms]);

            callback?.({
                success: true,
                message: "Left room successfully."
            });

        } catch (error: any) {
            handleSocketError(error, callback);

        };
    });
};