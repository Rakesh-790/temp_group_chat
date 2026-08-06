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

export const removeUserFromGroupRoom = (
    userId: string,
    groupId: string
): void => {

    socketManager.removeUserFromRoom(
        userId,
        groupId
    );
}