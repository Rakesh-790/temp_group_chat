import { useEffect, useMemo, useRef } from "react";
import { useChatStore } from "../../../store/chat.store";
import { mapMessage } from "../../../utils/message.mapper";
import MessageBubble from "./MessageBubble";
import DateSeparator from "./DateSeparator";
import { useMessages } from "../../../hooks/useMessage";
import SystemMessage from "../SystemMessage";
import { useDeliveryReceipt } from "../../../hooks/useDeliveryRecipt";
import { useReadReceipt } from "../../../hooks/useReadReceipt";

const MessageList = () => {

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const selectedChat = useChatStore(
        (state) => state.selectedChat
    );

    const recipientCount = selectedChat
    ? selectedChat.members.length - 1
    : 0;

    const { data, isPending, error } = useMessages(selectedChat?._id ?? null);
    
    useDeliveryReceipt(
        selectedChat?._id ?? null,
        data?.messages ?? []
    );

    useReadReceipt(
        selectedChat?._id ?? null,
        data?.messages ?? []
    );

    const messages = useMemo(() => {
        return (
            data?.messages.map((message) =>
                mapMessage(message, recipientCount)
            ) ?? []
        );
    }, [data, recipientCount]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    if (isPending) {
        return (
            <div className="flex flex-1 items-center justify-center bg-[#0b141a]">
                Loading messages...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center bg-[#0b141a]">
                Failed to load messages
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#0b141a] px-6 py-4">

            <div className="px-8 py-4">

                <DateSeparator label="Today" />

                {messages.map((message) =>
                    message.type === "SYSTEM" ? (
                        <SystemMessage
                            key={message.id}
                            message={message}
                        />
                    ) : (
                        <MessageBubble
                            key={message.id}
                            message={message}
                        />
                    )
                )}

                <div ref={bottomRef} />

            </div>

        </div>
    );
};

export default MessageList;