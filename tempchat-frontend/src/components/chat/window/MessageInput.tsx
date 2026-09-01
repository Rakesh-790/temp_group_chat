import { useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import { useChatStore } from "../../../store/chat.store";
import { sendMessage } from "../../../service/socket.service";

const MAX_HEIGHT = 140;

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { selectedChat } = useChatStore();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "0px";

        textarea.style.height = `${Math.min(
            textarea.scrollHeight,
            MAX_HEIGHT
        )}px`;
    }, [message]);

    const handleSendMessage = async () => {

        const content = message.trim();

        if (!content || !selectedChat) {
            return;
        };

        try {
            await sendMessage({
                groupId: selectedChat._id,
                content,
            });

            setMessage("");

        } catch (error) {
            console.error(error);
        };

    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key !== "Enter") return;

        if (event.shiftKey) return;

        event.preventDefault();

        handleSendMessage();
    };

    return (
        <footer className="border-t border-[#2a3942] bg-[#202c33] px-4 py-3">
            <div className="flex items-end gap-3">
                {/* Emoji */}
                <button
                    className="
                        mb-2
                        rounded-lg
                        p-2
                        text-[#8696a0]
                        transition
                        hover:bg-[#2a3942]
                        hover:text-white
                    "
                >
                    <Smile size={22} />
                </button>

                {/* Attachment */}
                <button
                    className="
                        mb-2
                        rounded-lg
                        p-2
                        text-[#8696a0]
                        transition
                        hover:bg-[#2a3942]
                        hover:text-white
                    "
                >
                    <Paperclip size={22} />
                </button>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                    className="
                        max-h-35
                        min-h-11
                        flex-1
                        resize-none
                        overflow-y-auto
                        rounded-xl
                        bg-[#2a3942]
                        px-4
                        py-3
                        outline-none
                        placeholder:text-[#e9edf0]
                        text-[#e9edf0]
                    "
                />

                {/* Send */}
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="
                        mb-2
                        rounded-lg
                        bg-[#00a884]
                        p-2
                        text-white
                        transition
                        hover:bg-[#02bd95]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <SendHorizontal size={20} />
                </button>
            </div>
        </footer>
    );
};

export default MessageInput;