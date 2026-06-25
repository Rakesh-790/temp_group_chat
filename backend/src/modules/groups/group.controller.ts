import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { createGroup, joinGroup } from "./group.service";


export const createTempGroup = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const {
            name,
            description,
            duration
        } = req.body;

        const ownerId = req.user!.id;

        const group = await createGroup({
            name,
            description,
            duration,
            ownerId
        });

        return res.status(201).json({
            success: true,
            message: 'Temporary Group Created',
            group
        });
    }
);

export const joinTempGroup = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const {
            inviteCode
        } = req.body;


        const group = await joinGroup(
            inviteCode,
            req.user!.id
        );


        return res.status(200).json({
            success: true,
            message: 'Joined Group Successfully',
            group
        });

    }
);