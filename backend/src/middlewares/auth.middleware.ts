import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { authenticateAccessToken } from "../modules/auth/auth.service";

interface AuthRequest extends Request {
    user?: {
        id: string,
        role: string,
        sessionId: string
    };
};

export const authMiddleware = catchAsync(
    async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return next(new AppError(
                    "Authentication Required",
                    401
                )
            );
        };

        const AuthenticatedUser = await authenticateAccessToken(accessToken);

        req.user = AuthenticatedUser;

        next();
    }
);