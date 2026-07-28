import type { GroupMember } from "../../types/group.types";

interface GroupMemberItemProps {
    member: GroupMember;
}

const roleStyles = {
    OWNER: "bg-green-500/15 text-green-400 border border-green-500/30",
    ADMIN: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    MEMBER: "bg-[#202c33] text-[#8696a0] border border-[#2a3942]",
};

const GroupMemberItem = ({ member }: GroupMemberItemProps) => {
    return (
        <div className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#202c33]">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                {member.user.avatar?.url ? (
                    <img
                        src={member.user.avatar.url}
                        alt={member.user.username}
                        className="h-14 w-14 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#54656f] text-xl font-semibold text-white">
                        {member.user.username.charAt(0).toUpperCase()}
                    </div>
                )}

                {/* User Info */}
                <div className="min-w-0">
                    <h4 className="truncate text-base font-semibold text-white">
                        {member.user.username}
                    </h4>

                    <p className="mt-1 truncate text-sm text-[#8696a0]">
                        {member.user.bio?.trim() || "No bio available"}
                    </p>
                </div>
            </div>

            {/* Role Badge */}
            <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyles[member.role]}`}
            >
                {member.role}
            </span>
        </div>
    );
};

export default GroupMemberItem;