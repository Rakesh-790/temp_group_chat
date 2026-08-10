import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { assignRole, createGroup, getAllGroups, getGroupById, joinGroup, removeMember, softDeleteGroup, updateGroup, updateGroupAvatar } from "./group.service";
import { emitGroupRemoved, emitGroupUpdated, emitMessageToUsers, emitNewMessage, removeUserFromGroupRoom } from "../../socket/emitter/socket.emitter";
import { AppError } from "../../utils/AppError";


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

        emitNewMessage(
            group.id,
            group.systemMessage
        );

        emitGroupUpdated(
            group.memberIds,
            {
                groupId: group.id,
                action: "MEMBER_JOINED",
            }
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

        emitGroupUpdated(
            result.memberIds,
            {
                groupId: result.groupId,
                action: "ROLE_CHANGED",
            }
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

        const groupId = req.params.groupId as string;

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
    async (
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
    async (
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

export const updateGroupController = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const groupId = req.params.groupId as string;

        const requesterId = req.user!.id;

        const {
            name,
            description
        } = req.body;

        const result = await updateGroup(
            groupId,
            requesterId,
            {
                name,
                description,
            }
        );

        for (const systemMessage of result.systemMessages) {
            emitNewMessage(
                groupId,
                systemMessage
            );
        }

        return res.status(200).json({
            success: true,
            message: "Group updated successfully",
            data: result.group,
        });
    }
);

export const updateGroupAvatarController = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const groupId = req.params.groupId as string;

        const requesterId = req.user!.id;

        if (!req.file) {
            throw new AppError(
                "Avatar is required",
                400
            );
        }

        const result = await updateGroupAvatar(
            groupId,
            requesterId,
            req.file
        );

        emitNewMessage(
            groupId,
            result.systemMessage
        );

        return res.status(200).json({
            success: true,
            message: "Group avatar updated successfully",
            data: result.group,
        });
    }
);

export const removeGroupMember = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const groupId = req.params.groupId as string;

        const targetUserId = req.params.userId as string;

        const requesterId = req.user!.id;

        const result = await removeMember(
            groupId,
            requesterId,
            targetUserId
        );

        // Send the removal system message to all remaining members
        emitMessageToUsers(
            result.memberIds,
            result.systemMessage
        );

        // Notify remaining members that the group membership changed
        emitGroupUpdated(
            result.memberIds,
            {
                groupId,
                action: "MEMBER_REMOVED",
            }
        );

        // Notify the removed member
        emitGroupRemoved(
            targetUserId,
            {
                groupId,
                groupName: result.groupName,
                removedBy: requesterId,
            }
        );

        // Remove the user from the group room
        removeUserFromGroupRoom(
            targetUserId,
            groupId
        );

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
            data: result,
        });

    }
);