import { Socket } from "socket.io";
import { handleSocketError } from "./socket.error";

type socketEventHandler<T = any> = (
    data: T,
    callback?: (...arg : any[]) => void
) => Promise<void> | void ;

export const socketEvent = <T = any> (
    socket : Socket,
    handler: socketEventHandler<T>
) => {

    return async(
        data: T,
        callback?: (...args: any[]) => void
    ) : Promise<void> => {

        try {
            await handler(data, callback);
        } catch (error) {
            handleSocketError(socket, error, callback);
        };
    };
};