import { useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";

const MAX_HEIGHT = 140;

const MessageInput = () => {
    const [message, setMessage] = useState("");

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

    const sendMessage = () => {
        const value = message.trim();

        if (!value) return;

        console.log(value);

        setMessage("");
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key !== "Enter") return;

        if (event.shiftKey) return;

        event.preventDefault();

        sendMessage();
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
                        max-h-[140px]
                        min-h-[44px]
                        flex-1
                        resize-none
                        overflow-y-auto
                        rounded-xl
                        bg-[#2a3942]
                        px-4
                        py-3
                        outline-none
                        placeholder:text-[#e9edf0]
                    "
                />

                {/* Send */}
                <button
                    onClick={sendMessage}
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