import { socket } from "../api/socket";
import { MessageType } from "../types/message.types";

export const connectSocket = () => {
    console.log("connectSocket called", {
        connected: socket.connected,
        id: socket.id,
    });

    if (!socket.connected) {
        console.log("Calling socket.connect()");
        socket.connect();
    }
};

export const disconnectSocket = () => {
    console.log("disconnectSocket called", {
        connected: socket.connected,
        id: socket.id,
    });

    if (socket.connected) {
        socket.disconnect();
    }
};

export const joinRoom = (groupId: string) => {
    socket.emit(
        "room:join",
        { roomId: groupId },
        (response: any) => {
            console.log("Join room response:", response);
        }
    );
};

export const leaveRoom = (groupId: string) => {
    socket.emit(
        "room:leave",
        { roomId: groupId },
        (response: any) => {
            console.log("Leave room response:", response);
        }
    );
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