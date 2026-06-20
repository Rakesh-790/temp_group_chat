import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { catchAsync } from "../../utils/catchAsync";
import { getUserSessions, revokeSession } from "./session.service";

export const getSessions = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const sessions = await getUserSessions(
            req.user!.id
        );

        res.status(200).json({
            success: true,
            count: sessions.length,
            sessions
        });
    }
);

export const deleteSession = catchAsync(
    async (req: AuthRequest, res: Response) => {

        await revokeSession(
            req.params.id as string,
            req.user!.id
        );

        res.status(200).json({
            success: true,
            message: 'Session revoked successfully'
        });

    }
);