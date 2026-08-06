import { AppError } from "../../utils/AppError";
import { IGroup, IGroupMember } from "./group.model";

const getMemberUserId = (
    member: IGroupMember
): string => {

    const user = member.user as any;

    return user._id
        ? user._id.toString()
        : user.toString();
};

export const getGroupMember = (
    group: IGroup,
    userId: string
): IGroupMember => {

    const member = group.members.find(
        member => getMemberUserId(member) === userId
    );

    if (!member) {
        throw new AppError(
            "User is not a member of this group",
            404
        );
    }

    return member;
};

export const ensureUserIsMember = (
    group: IGroup,
    userId: string
): void => {

    const isMember = group.members.some(
        member => getMemberUserId(member) === userId
    );

    if (!isMember) {
        throw new AppError(
            "User is not a member of this group",
            403
        );
    }
};

export const ensureUserIsNotMember = (
    group: IGroup,
    userId: string
): void => {

    const isMember = group.members.some(
        member => getMemberUserId(member) === userId
    );

    if (isMember) {
        throw new AppError(
            "Already a member of this group",
            400
        );
    }
};

export const ensureGroupManager = (
    group: IGroup,
    userId: string
): void => {

    const member = getGroupMember(
        group,
        userId
    );

    if (
        member.role !== "OWNER" &&
        member.role !== "ADMIN"
    ) {
        throw new AppError(
            "Only owner or admin can perform this action",
            403
        );
    }
};

export const ensureGroupOwner = (
    group: IGroup,
    userId: string
): void => {

    const member = getGroupMember(
        group,
        userId
    );

    if (member.role !== "OWNER") {
        throw new AppError(
            "Only owner can perform this action",
            403
        );
    }
};

export const ensureCanRemoveMember = (
    group: IGroup,
    requesterId: string,
    targetUserId: string
): void => {

    const requester = getGroupMember(
        group,
        requesterId
    );

    const target = getGroupMember(
        group,
        targetUserId
    );

    if (requesterId === targetUserId) {
        throw new AppError(
            "You cannot remove yourself",
            400
        );
    }

    if (target.role === "OWNER") {
        throw new AppError(
            "Owner cannot be removed",
            403
        );
    }

    if (requester.role === "OWNER") {
        return;
    }

    if (
        requester.role === "ADMIN" &&
        target.role === "MEMBER"
    ) {
        return;
    }

    throw new AppError(
        "You don't have permission to remove this member",
        403
    );
};