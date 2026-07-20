import { useChatStore } from "../../../store/chat.store";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatWindow = () => {
    const selectedChat = useChatStore(
        (state) => state.selectedChat
    );

    if (!selectedChat) {
        return (
            <main className="flex flex-1 items-center justify-center bg-[#0b141a]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white">
                        TempChat
                    </h2>

                    <p className="mt-2 text-[#8696a0]">
                        Select a conversation to start messaging.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col bg-[#0b141a]">
            <ChatHeader chat={selectedChat} />

            <MessageList />

            <MessageInput />
        </main>
    );
};

export default ChatWindow;