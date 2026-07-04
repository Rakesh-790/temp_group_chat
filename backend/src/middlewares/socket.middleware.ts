import { Socket } from "socket.io";
import { AppError } from "../utils/AppError";
import cookie from 'cookie';
import { authenticateAccessToken } from "../modules/auth/auth.service";

// export const socketAuthMiddleware = async (
//     socket: Socket,
//     next: (err?: Error) => void
// ): Promise<void> => {

//     try {
//         const cookieHeader = socket.handshake.headers.cookie;

//         let accessToken: string | undefined;

//         if (!cookieHeader) {
//             return next(
//                 new AppError(
//                     'Authentication Required',
//                     401
//                 )
//             );
//         };

//         const cookies = cookie.parse(cookieHeader);
//         accessToken = cookies.accessToken;

//         // const accessToken = cookies.accessToken;

//         if (!accessToken) {
//             return next(
//                 new AppError(
//                     'Authentication Required',
//                     401
//                 )
//             );
//         };

//         const authenticatedUser = await authenticateAccessToken(accessToken);

//         console.log("Socket Connected: ", socket.id);

//         socket.data.user = authenticatedUser;

//         next();

//     } catch (error) {
//         next(error as Error);
//     }

// };

export const socketAuthMiddleware = async (
    socket: Socket,
    next: (err?: Error) => void
): Promise<void> => {

    try {

        let accessToken: string | undefined;

        // 1. Try to get access token from cookies (Production)
        const cookieHeader = socket.handshake.headers.cookie;

        if (cookieHeader) {
            const cookies = cookie.parse(cookieHeader);
            accessToken = cookies.accessToken;
        }

        // 2. If cookie is not available, use handshake auth (Temporary Testing)
        if (!accessToken) {
            accessToken = socket.handshake.auth.accessToken;
        }

        // 3. Reject if no token found
        if (!accessToken) {
            return next(
                new AppError(
                    "Authentication Required",
                    401
                )
            );
        }

        // 4. Authenticate token
        const authenticatedUser = await authenticateAccessToken(
            accessToken
        );

        // 5. Store authenticated user on socket
        socket.data.user = authenticatedUser;

        console.log("✅ Socket Authenticated:", authenticatedUser.id);

        next();

    } catch (error) {

        next(error as Error);

    }

};