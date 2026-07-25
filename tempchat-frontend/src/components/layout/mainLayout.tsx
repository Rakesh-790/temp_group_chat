import LeftRail from "./LeftRail";
import Sidebar from "./Sidebar";
import ChatWindow from "../chat/window/ChatWindow";
import { useUIStore } from "../../store/ui.store";
import ProfilePanel from "../../pages/profile/ProfilePanel";
import ProfileView from "../profile/ProfileView";

const MainLayout = () => {
    const { activePanel } = useUIStore();

    return (
        <div className="flex h-screen overflow-hidden bg-[#111b21]">
            <LeftRail />

            {activePanel === "chats" && (
                <>
                    <Sidebar />
                    <ChatWindow />
                </>
            )}

            {activePanel === "profile" && (
                <>
                    <ProfilePanel />
                    <ProfileView />
                </>
            )}
        </div>
    );
};

export default MainLayout;