import {
    MessageCircle,
    Users,
    Star,
    Settings,
    LogOut,
} from "lucide-react";

const LeftRail = () => {
    return (
        <aside className="flex w-20 flex-col items-center justify-between border-r border-[#2a3942] bg-[#202c33] py-4">
            {/* Top Section */}
            <div className="flex flex-col items-center gap-6">
                {/* Avatar */}
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#54656f] text-lg font-semibold text-white transition hover:bg-[#6a7a84]">
                    R
                </button>

                {/* Navigation */}
                <nav className="flex flex-col items-center gap-3">
                    <RailButton active>
                        <MessageCircle size={22} />
                    </RailButton>

                    <RailButton>
                        <Users size={22} />
                    </RailButton>

                    <RailButton>
                        <Star size={22} />
                    </RailButton>
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col items-center gap-3">
                <RailButton>
                    <Settings size={22} />
                </RailButton>

                <RailButton>
                    <LogOut size={22} />
                </RailButton>
            </div>
        </aside>
    );
};

interface RailButtonProps {
    children: React.ReactNode;
    active?: boolean;
}

const RailButton = ({ children, active = false }: RailButtonProps) => {
    return (
        <button
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                active
                    ? "bg-[#2a3942] text-[#00a884]"
                    : "text-[#8696a0] hover:bg-[#2a3942] hover:text-white"
            }`}
        >
            {children}
        </button>
    );
};

export default LeftRail;