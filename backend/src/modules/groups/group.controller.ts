import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { assignRole, createGroup, getAllGroups, getGroupById, joinGroup, softDeleteGroup } from "./group.service";
import { emitNewMessage } from "../../socket/emitter/socket.emitter";


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

        const groupId = req.params.groupId as string;

        const result = await assignRole(
            groupId,
            req.user!.id,
            userId,
            role
        );

        emitNewMessage(
            result.groupId,
            result.systemMessage
        );

        return res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            data: result
        });
    }
);

export const deleteTempGroup = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const groupId  = req.params.groupId as string;

        const group = await softDeleteGroup(
            groupId,
            req.user!.id
        );

        return res.status(200).json({
            success: true,
            message: 'Group deleted successfully',
            group
        });
    }
);

export const getGroupByIdController = catchAsync(
    async(
        req: Request,
        res: Response
    ) => {

        const groupId = req.params.groupId as string;

        const group = await getGroupById(groupId);

        return res.status(200).json({
            success: true,
            message: 'Group fetched successfully with Id',
            group
        })
    }
);

export const getAllGroupsController = catchAsync(
    async(
        req: AuthRequest,
        res: Response
    ) => {

        const userId = req.user!.id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const groups = await getAllGroups(userId, page, limit);

        return res.status(200).json({
            success: true,
            message: "All groups fetched successfully",
            groups
        });
    }
);