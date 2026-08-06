import { IMessage } from "../../modules/messages/message.model";
import { getIo } from "../socket.server";
import { socketManager } from "../socket.manager";

interface GroupRemovedPayload {
    groupId: string;
    groupName: string;
    removedBy: string;
};

interface MemberRemovedPayload {
    groupId: string;
    removedUserId: string;
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
    payload: MemberRemovedPayload
): void => {

    getIo()
        .to(payload.groupId)
        .emit(
            "group:memberRemoved",
            payload
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