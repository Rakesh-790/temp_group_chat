import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { Socket } from "socket.io";

export interface SocketAckResponse {
    success: boolean;
    message: string;
    statusCode: number;
}

export const handleSocketError = (
    socket: Socket,
    error: unknown,
    callback?: (response: SocketAckResponse) => void
): void => {
    let response: SocketAckResponse;

    if (error instanceof ZodError) {
        response = {
            success: false,
            message: error.issues[0]?.message ?? "validation failed",
            statusCode: 400
        };
    } else if (error instanceof AppError) {
        response = {
            success: false,
            message: error.message,
            statusCode: error.statusCode
        };
    } else {
        console.error(error);

        response = {
            success: false,
            message: "Internal server Error",
            statusCode: 500
        };
    };

    if (callback) {
        callback(response);
        return;
    }

    socket.emit("socket:error", response);

};