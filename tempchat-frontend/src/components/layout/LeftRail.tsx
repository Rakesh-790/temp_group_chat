import {
    MessageCircle,
    Plus,
    LogOut,
    UserPlus,
} from "lucide-react";
import { useState } from "react";
import CreateGroupModal from "../group/CreateGroupModal";
import JoinGroupModal from "../group/JoinGroupModal";
import type { CreatedGroup } from "../../types/group.types";
import GroupInviteModal from "../group/GroupInviteModal";
import LogoutModal from "../auth/LogoutModal";
import { useUIStore } from "../../store/ui.store";
import { useProfile } from "../../hooks/profile/useProfile";


const LeftRail = () => {

    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [isJoinGroupOpen, setIsJoinGroupOpen] = useState(false);
    const [createdGroup, setCreatedGroup] = useState<CreatedGroup | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const { activePanel, setActivePanel } = useUIStore();

    const { data: profile } = useProfile();

    const handleGroupCreated = (group: CreatedGroup) => {
        setCreatedGroup(group);

        setIsInviteModalOpen(true);
    };

    return (
        <>
            <aside className="flex w-20 flex-col items-center justify-between border-r border-[#2a3942] bg-[#202c33] py-4">
                {/* Top Section */}
                <div className="flex flex-col items-center gap-6">
                    {/* Avatar */}
                    <button
                        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#54656f]"
                        onClick={() => setActivePanel("profile")}
                    >
                        {profile?.avatar?.url ? (
                            <img
                                src={profile.avatar.url}
                                alt={profile.username}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-lg font-semibold text-white">
                                {profile?.username?.charAt(0).toUpperCase() ?? "R"}
                            </span>
                        )}
                    </button>
                    {/* Navigation */}
                    <nav className="flex flex-col items-center gap-3">
                        <RailButton
                            active={activePanel === "chats"}
                            onClick={() => setActivePanel("chats")}
                        >
                            <MessageCircle size={22} />
                        </RailButton>
                        <RailButton
                            onClick={() => setIsCreateGroupOpen(true)}
                        >
                            <Plus size={22} />
                        </RailButton>

                        <RailButton
                            onClick={() => setIsJoinGroupOpen(true)}
                        >
                            <UserPlus size={22} />
                        </RailButton>

                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center gap-3">
                    <RailButton
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <LogOut size={22} />
                    </RailButton>
                </div>
            </aside>

            <CreateGroupModal
                isOpen={isCreateGroupOpen}
                onClose={() => setIsCreateGroupOpen(false)}
                onGroupCreated={handleGroupCreated}
            />

            <GroupInviteModal
                isOpen={isInviteModalOpen}
                onClose={() => {
                    setIsInviteModalOpen(false);
                    setCreatedGroup(null);
                }}
                group={createdGroup}
            />

            <JoinGroupModal
                isOpen={isJoinGroupOpen}
                onClose={() => setIsJoinGroupOpen(false)}
            />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
};

interface RailButtonProps {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

const RailButton = ({
    children,
    active = false,
    onClick,
}: RailButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${active
                ? "bg-[#2a3942] text-[#00a884]"
                : "text-[#8696a0] hover:bg-[#2a3942] hover:text-white"
                }`}
        >
            {children}
        </button>
    );
};

export default LeftRail;