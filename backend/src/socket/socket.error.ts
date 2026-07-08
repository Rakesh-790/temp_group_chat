import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export interface SocketAckResponse {
    success: boolean;
    message: string;
}

export const handleSocketError = (
    error: unknown,
    callback?: (response: SocketAckResponse) => void
): void => {

    if (error instanceof ZodError) {
        callback?.({
            success: false,
            message: error.issues[0].message
        });
        return;
    }

    if (error instanceof AppError) {
        callback?.({
            success: false,
            message: error.message
        });
        return;
    }

    console.error(error);

    callback?.({
        success: false,
        message: "Internal server error"
    });

};