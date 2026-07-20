import LeftRail from "./LeftRail";
import Sidebar from "./Sidebar";
import ChatWindow from "../chat/window/ChatWindow";

const MainLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#111b21]">
            <LeftRail />

            <Sidebar />

            <ChatWindow />
        </div>
    );
};

export default MainLayout;