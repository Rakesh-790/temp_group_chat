import { Check, CheckCheck, Clock3 } from "lucide-react";
import type { Message } from "../../../types/message.types";

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
    if (message.type === "SYSTEM") {
        return null;
    };
    const renderStatus = () => {
        if (!message.isMine) return null;

        switch (message.status) {
            case "sending":
                return (
                    <Clock3
                        size={14}
                        className="text-[#8696a0]"
                    />
                );

            case "sent":
                return (
                    <Check
                        size={14}
                        className="text-[#8696a0]"
                    />
                );

            case "delivered":
                return (
                    <CheckCheck
                        size={14}
                        className="text-[#8696a0]"
                    />
                );

            case "read":
                return (
                    <CheckCheck
                        size={14}
                        className="text-sky-400"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={`group mb-2 flex ${
                message.isMine
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`relative max-w-[70%] rounded-xl px-3 py-2 shadow-sm transition-colors ${
                    message.isMine
                        ? "bg-[#005c4b]"
                        : "bg-[#202c33]"
                }`}
            >
                {/* Sender Name */}
                {!message.isMine && (
                    <p className="mb-1 text-xs font-semibold text-[#53bdeb]">
                        {message.senderName}
                    </p>
                )}

                {/* Message */}
                <p className="whitespace-pre-wrap warp-break-words text-[15px] leading-6 text-white">
                    {message.content}
                </p>

                {/* Footer */}
                <div className="mt-1 flex items-center justify-end gap-1">
                    <span className="text-[11px] text-[#aebac1]">
                        {message.createdAt}
                    </span>

                    {renderStatus()}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;