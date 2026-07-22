import { useEffect, useRef } from "react";
import { useChatStore } from "../store/chat.store";
import { joinRoom, leaveRoom } from "../service/socket.service";

export const useRoom = () => {
    const selectedChat = useChatStore((state) => state.selectedChat);
    const previousRoom = useRef<string | null>(null);

    useEffect(() => {
        const currentRoom = selectedChat?._id;

        if (!currentRoom) return;

        if (
            previousRoom.current &&
            previousRoom.current !== currentRoom
        ) {
            leaveRoom(previousRoom.current);
        }

        joinRoom(currentRoom);
        previousRoom.current = currentRoom;
    }, [selectedChat]);
};