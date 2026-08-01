import { socket } from "../api/socket";
import { MessageType } from "../types/message.types";

type SocketAck = {
    success: boolean;
    message: string;
};

type SendMessagePayload = {
    groupId: string;
    content: string;
};

type MarkMessagesDeliveredPayload = {
    groupId: string;
    messageIds: string[];
};

export const connectSocket = (): void => {

    if (!socket.connected) {
        socket.connect();
    }

};

export const disconnectSocket = (): void => {

    if (socket.connected) {
        socket.disconnect();
    }

};

export const joinRoom = (
    groupId: string
): Promise<SocketAck> => {

    return new Promise((resolve, reject) => {

        socket.emit(
            "room:join",
            { roomId: groupId },
            (response: SocketAck) => {

                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.message));
                }

            }
        );

    });

};

export const leaveRoom = (
    groupId: string
): Promise<SocketAck> => {

    return new Promise((resolve, reject) => {

        socket.emit(
            "room:leave",
            { roomId: groupId },
            (response: SocketAck) => {

                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.message));
                }

            }
        );

    });

};

export const sendMessage = (
    payload: SendMessagePayload
): Promise<SocketAck> => {

    return new Promise((resolve, reject) => {

        socket.emit(
            "message:send",
            {
                groupId: payload.groupId,
                type: MessageType.TEXT,
                content: payload.content,
            },
            (response: SocketAck) => {

                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.message));
                }

            }
        );

    });

};

export const markMessagesDelivered = (
    payload: MarkMessagesDeliveredPayload
): Promise<SocketAck> => {

    return new Promise((resolve, reject) => {

        socket.emit(
            "message:delivered",
            payload,
            (response: SocketAck) => {

                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.message));
                }

            }
        );

    });

};

type MarkMessagesReadPayload = {
    groupId: string;
    messageIds: string[];
};

export const markMessagesRead = (
    payload: MarkMessagesReadPayload
): Promise<SocketAck> => {

    return new Promise((resolve, reject) => {

        socket.emit(
            "message:read",
            payload,
            (response: SocketAck) => {

                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.message));
                }

            }
        );

    });

};