import { Socket } from "socket.io";
import { AppError } from "../utils/AppError";
import cookie from 'cookie';
import { authenticateAccessToken } from "../modules/auth/auth.service";

export const socketAuthMiddleware = async (
    socket: Socket,
    next: (err?: Error) => void
): Promise<void> => {

    try {
        const cookieHeader = socket.handshake.headers.cookie;

        let accessToken: string | undefined;

        if (!cookieHeader) {
            return next(
                new AppError(
                    'Authentication Required',
                    401
                )
            );  
        };

        const cookies = cookie.parseCookie(cookieHeader);
        accessToken = cookies.accessToken;

        if (!accessToken) {
            return next(
                new AppError(
                    'Authentication Required',
                    401
                )
            );
        };

        const authenticatedUser = await authenticateAccessToken(accessToken);

        console.log("Socket Connected: ", socket.id);

        socket.data.user = authenticatedUser;

        next();

    } catch (error) {
        next(error as Error);
    }

};

