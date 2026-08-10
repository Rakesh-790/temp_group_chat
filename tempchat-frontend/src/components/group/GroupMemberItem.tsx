import { useState } from "react";
import { useAssignRole } from "../../hooks/useAssignRole";
import type { GroupMember } from "../../types/group.types";
import MemberActionMenu from "./MemberActionMenu";
import RemoveMemberModal from "./RemoveMemberModal";

interface GroupMemberItemProps {
    groupId: string;

    groupName: string;

    member: GroupMember;

    currentUserId: string;

    currentUserRole: "OWNER" | "ADMIN" | "MEMBER";
}

const roleStyles = {
    OWNER: "bg-green-500/15 text-green-400 border border-green-500/30",
    ADMIN: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    MEMBER: "bg-[#202c33] text-[#8696a0] border border-[#2a3942]",
};

const GroupMemberItem = ({
    groupId,
    groupName,
    member,
    currentUserId,
    currentUserRole,
}: GroupMemberItemProps) => {

    const assignRoleMutation = useAssignRole();

    const [removeModalOpen, setRemoveModalOpen] =
        useState(false);

    const isSelf =
        member.user._id === currentUserId;

    const canPromote =
        currentUserRole === "OWNER" &&
        member.role === "MEMBER";

    const canDemote =
        currentUserRole === "OWNER" &&
        member.role === "ADMIN";

    const canRemove =
        !isSelf &&
        (
            (
                currentUserRole === "OWNER" &&
                member.role !== "OWNER"
            ) ||
            (
                currentUserRole === "ADMIN" &&
                member.role === "MEMBER"
            )
        );

    const handlePromote = () => {

        assignRoleMutation.mutate({
            groupId,
            userId: member.user._id,
            role: "ADMIN",
        });

    };

    const handleDemote = () => {

        assignRoleMutation.mutate({
            groupId,
            userId: member.user._id,
            role: "MEMBER",
        });

    };

    const handleRemove = () => {

        setRemoveModalOpen(true);

    };

    return (
        <>

            <div className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#202c33]">

                <div className="flex items-center gap-4">

                    {member.user.avatar?.url ? (

                        <img
                            src={member.user.avatar.url}
                            alt={member.user.username}
                            className="h-14 w-14 rounded-full object-cover"
                        />

                    ) : (

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#54656f] text-xl font-semibold text-white">

                            {member.user.username
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                    )}

                    <div className="min-w-0">

                        <h4 className="truncate text-base font-semibold text-white">

                            {member.user.username}

                        </h4>

                        <p className="mt-1 truncate text-sm text-[#8696a0]">

                            {member.user.bio?.trim() ||
                                "No bio available"}

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-2">

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyles[member.role]}`}
                    >

                        {member.role}

                    </span>

                    <MemberActionMenu
                        loading={
                            assignRoleMutation.isPending
                        }
                        canPromote={canPromote}
                        canDemote={canDemote}
                        canRemove={canRemove}
                        onPromote={handlePromote}
                        onDemote={handleDemote}
                        onRemove={handleRemove}
                    />

                </div>

            </div>

            <RemoveMemberModal
                isOpen={removeModalOpen}
                onClose={() => setRemoveModalOpen(false)}
                groupId={groupId}
                groupName={groupName}
                userId={member.user._id}
                username={member.user.username}
            />

        </>
    );

};

export default GroupMemberItem;