import { socket } from "../api/socket";
import { MessageType } from "../types/message.types";

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export const joinRoom = (groupId: string) => {
    console.log("Joining room:", groupId);
    socket.emit("room:join", groupId);
};

export const leaveRoom = (groupId: string) => {
    console.log("Leaving room:", groupId);
    socket.emit("room:leave", groupId);
};

export const sendMessage = (
    groupId: string,
    content: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        socket.emit(
            "message:send",
            {
                groupId,
                type: MessageType.TEXT,
                content,
            },
            (response: {
                success: boolean;
                message: string;
            }) => {
                if (response.success) {
                    resolve();
                } else {
                    reject(new Error(response.message));
                }
            }
        );
    });
};