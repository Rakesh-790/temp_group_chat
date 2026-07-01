import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/auth.utils";
import userModel from "../modules/auth/auth.model";
import { findValidSession } from "../modules/session/session.service";

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

        let decoded: {
            sessionId: string;
            id: string;
        };

        try {
            decoded = verifyAccessToken(accessToken) as {
                sessionId: string;
                id: string;
            };
        } catch {
            return next(
                new AppError(
                    "Invalid or Expired Token",
                    401
                )
            );
        }

        const session = await findValidSession(decoded.sessionId);

        if (!session) {
            return next(
                new AppError(
                    "Session not Found",
                    401
                )
            );
        };

        if (session.isRevoked) {
            return next(
                new AppError(
                    "Session Revoked",
                    401
                )
            );
        };

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return next(
                new AppError(
                    "User not Found",
                    404
                )
            );
        };

        req.user = {
            id: user._id.toString(),
            role: user.role,
            sessionId: session.toString()
        };

        next();
    }
);