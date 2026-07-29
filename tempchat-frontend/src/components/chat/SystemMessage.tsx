import { useChatStore } from "../../store/chat.store";
import type { Message } from "../../types/message.types";
import { formatSystemMessage } from "../../utils/systemMessageFormatter";

interface SystemMessageProps {
    message: Message;
}

const SystemMessage = ({ message }: SystemMessageProps) => {
    const { selectedChat } = useChatStore();

    const text = formatSystemMessage(
        message,
        selectedChat?.members ?? []
    );

    const formattedTime = message.createdAt;

    return (
        <div className="my-4 flex justify-center">
            <div className="max-w-xl rounded-lg bg-[#1f2c34] px-4 py-2 shadow">
                <p className="text-center text-sm text-[#d1d7db]">
                    {text}
                </p>

                <p className="mt-1 text-center text-[11px] text-[#8696a0]">
                    {formattedTime}
                </p>
            </div>
        </div>
    );
};

export default SystemMessage;