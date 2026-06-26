import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { assignRole, createGroup, joinGroup } from "./group.service";
import { success } from "zod";


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

export const assignMemberRole = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const { userId, role } = req.body;

        const groupId  = req.params.groupId as string;

        const result = await assignRole(
            groupId,
            req.user!.id,
            userId,
            role
        );

        return res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            data: result
        });
    }
);