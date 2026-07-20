import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { getGroupMessages } from "./message.service";

export const getGroupMessagesController = catchAsync(
    async(
        req: AuthRequest,
        res: Response
    ) => {

        const groupId = req.params.groupId as string;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 30;

        const data = await getGroupMessages(
            groupId,
            req.user!.id,
            page,
            limit
        );

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data
        });
    }
)