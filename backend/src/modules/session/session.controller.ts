import { Request, Response } from "express";
import { AuthRequest } from "../auth/auth.types";
import { catchAsync } from "../../utils/catchAsync";
import { getAllSessions, getUserSessions, revokeSession } from "./session.service";
import { success } from "zod";

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

export const getAllUserSessions = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;


        const sessions = await getAllSessions(page, limit);

        res.status(200).json({
            success: true,
            message: "All Session Fetched successfully",
            ...sessions
        });
    }
);