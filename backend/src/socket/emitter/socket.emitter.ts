import { IMessage } from "../../modules/messages/message.model";
import { getIo } from "../socket.server";
import { socketManager } from "../socket.manager";
import { IGroup } from "../../modules/groups/group.model";

interface GroupRemovedPayload {
    groupId: string;
    groupName: string;
    removedBy: string;
};

export const emitNewMessage = (
    groupId: string,
    message: IMessage
): void => {

    getIo()
        .to(groupId)
        .emit("message:new", message);
};

export const emitMessageToUsers = (
    userIds: string[],
    message: IMessage
): void => {

    for (const userId of userIds) {

        socketManager.emitToUser(
            userId,
            "message:new",
            message
        );

    }
};

export const emitMemberRemoved = (
    group: IGroup
): void => {

    getIo()
        .to(group._id.toString())
        .emit(
            "group:memberRemoved",
            group
        );
};

export const emitGroupRemoved = (
    userId: string,
    payload: GroupRemovedPayload
): void => {

    socketManager.emitToUser(
        userId,
        "group:removed",
        payload
    );
};

interface GroupUpdatedPayload {
    groupId: string;
    action:
        | "MEMBER_JOINED"
        | "ROLE_CHANGED"
        | "MEMBER_REMOVED";
}

export const emitGroupUpdated = (
    memberIds: string[],
    payload: GroupUpdatedPayload
): void => {

    for (const memberId of memberIds) {

        socketManager.emitToUser(
            memberId,
            "group:updated",
            payload
        );

    }

};

export const emitGroupAvatarUpdated = (
    group: IGroup | null
): void => {

    if (!group) {
        return;
    }

    getIo()
        .to(group._id.toString())
        .emit(
            "group:avatarUpdated",
            group
        );
};

export const removeUserFromGroupRoom = (
    userId: string,
    groupId: string
): void => {

    socketManager.removeUserFromRoom(
        userId,
        groupId
    );
}