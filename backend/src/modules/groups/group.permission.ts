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

    const member = group.members.find(
        member => getMemberUserId(member) === userId
    );

    if (!member) {
        throw new AppError(
            "User is not a member of this group",
            403
        );
    }

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

    const member = group.members.find(
        member => getMemberUserId(member) === userId
    );

    if (!member) {
        throw new AppError(
            "User is not a member of this group",
            403
        );
    }

    if (member.role !== "OWNER") {
        throw new AppError(
            "Only owner can perform this action",
            403
        );
    }
};