import { Copy } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import GroupMemberItem from "./GroupMemberItem";
import type { Group } from "../../types/group.types";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";
import { useUpdateGroup } from "../../hooks/useUpdateGroup";
import { useUpdateGroupAvatar } from "../../hooks/useUpdateGroupAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupInfoCard from "./GroupInfoCard";
import EditGroupModal from "./EditGroupModal";

interface GroupInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group | null;
}

const GroupInfoModal = ({
    isOpen,
    onClose,
    group,
}: GroupInfoModalProps) => {
    if (!group) return null;

    const { user } = useAuthStore();

    const myMember = group.members.find(
        member => member.user._id === user?.id
    );

    const myRole = myMember?.role;

    const canEdit =
        myRole === "OWNER" || myRole === "ADMIN";

    const [editingField, setEditingField] = useState<
        "name" | "description" | null
    >(null);

    const updateGroupMutation = useUpdateGroup();

    const updateGroupAvatarMutation = useUpdateGroupAvatar();

    const handleCopyInviteCode = async () => {
        try {
            await navigator.clipboard.writeText(group.inviteCode);
            toast.success("Invite code copied!");
        } catch {
            toast.error("Failed to copy invite code.");
        }
    };

    const handleAvatarUpload = (file: File) => {
        updateGroupAvatarMutation.mutate({
            groupId: group._id,
            file,
        });
    };

    const handleSave = (value: string) => {

        if (!editingField) {
            return;
        }

        updateGroupMutation.mutate(
            {
                groupId: group._id,

                ...(editingField === "name"
                    ? { name: value }
                    : { description: value }),
            },
            {
                onSuccess: () => {
                    setEditingField(null);
                },
            }
        );
    };

    const createdDate = new Date(group.createdAt);

    const formattedDate = createdDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedTime = createdDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Group Info"
            className="max-w-3xl"
        >
            <div className="space-y-6">

                {/*  HEADER  */}

                <div className="flex flex-col items-center border-b border-[#2a3942] pb-8">

                    <GroupAvatar
                        groupName={group.name}
                        avatar={group.avatar?.url}
                        editable={canEdit}
                        loading={updateGroupAvatarMutation.isPending}
                        onFileSelect={handleAvatarUpload}
                    />

                    <div className="mt-6 w-full max-w-md">

                        <GroupInfoCard
                            label="Group Name"
                            value={group.name}
                            editable={canEdit}
                            onEdit={() =>
                                setEditingField("name")
                            }
                        />

                    </div>

                    <p className="mt-4 text-sm text-[#8696a0]">
                        {group.members.length} Members
                    </p>

                </div>

                {/*  DESCRIPTION  */}

                <section className="rounded-xl bg-[#111b21]">

                    <GroupInfoCard
                        label="Description"
                        value={
                            group.description?.trim()
                                ? group.description
                                : "No description has been added yet."
                        }
                        editable={canEdit}
                        onEdit={() =>
                            setEditingField("description")
                        }
                    />

                </section>

                {/*  INVITE CODE  */}

                <section className="rounded-xl bg-[#111b21]">

                    <div className="flex items-center justify-between border-b border-[#2a3942] px-5 py-3">

                        <h3 className="text-sm font-medium uppercase tracking-wide text-[#00a884]">
                            Invite Code
                        </h3>

                        <button
                            onClick={handleCopyInviteCode}
                            className="rounded-lg p-2 text-[#00a884] transition-colors hover:bg-[#202c33]"
                            title="Copy Invite Code"
                        >
                            <Copy size={18} />
                        </button>

                    </div>

                    <div className="px-5 py-4">

                        <div className="rounded-lg bg-[#202c33] px-4 py-3">

                            <p className="font-mono text-lg tracking-widest text-white">
                                {group.inviteCode}
                            </p>

                        </div>

                    </div>

                </section>

                {/* MEMBERS */}

                <section className="rounded-xl bg-[#111b21]">

                    <div className="border-b border-[#2a3942] px-5 py-3">

                        <h3 className="text-sm font-medium uppercase tracking-wide text-[#00a884]">
                            Members ({group.members.length})
                        </h3>

                    </div>

                    <div className="max-h-85 overflow-y-auto py-2">

                        {group.members.map((member) => {

                            return (
                                <GroupMemberItem
                                    key={member.user._id}
                                    groupId={group._id}
                                    groupName={group.name}
                                    member={member}
                                    currentUserId={user!.id}
                                    currentUserRole={myRole!}
                                />
                            );

                        })}

                    </div>

                </section>

                {/*  METADATA  */}

                <div className="grid gap-4 md:grid-cols-2">

                    {/* Created By */}

                    <section className="rounded-xl bg-[#111b21]">

                        <div className="border-b border-[#2a3942] px-5 py-3">

                            <h3 className="text-sm font-medium uppercase tracking-wide text-[#00a884]">
                                Created By
                            </h3>

                        </div>

                        <div className="flex items-center gap-4 px-5 py-4">

                            {group.owner.avatar?.url ? (
                                <img
                                    src={group.owner.avatar.url}
                                    alt={group.owner.username}
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#54656f] text-xl font-semibold text-white">
                                    {group.owner.username
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}

                            <div>

                                <h4 className="font-semibold text-white">
                                    {group.owner.username}
                                </h4>

                                <p className="mt-1 text-sm text-[#8696a0]">
                                    {group.owner.bio?.trim() ||
                                        "No bio available"}
                                </p>

                            </div>

                        </div>

                    </section>

                    {/* Created On */}

                    <section className="rounded-xl bg-[#111b21]">

                        <div className="border-b border-[#2a3942] px-5 py-3">

                            <h3 className="text-sm font-medium uppercase tracking-wide text-[#00a884]">
                                Created On
                            </h3>

                        </div>

                        <div className="px-5 py-4">

                            <p className="text-lg font-semibold text-white">
                                {formattedDate}
                            </p>

                            <p className="mt-2 text-sm text-[#8696a0]">
                                {formattedTime}
                            </p>

                        </div>

                    </section>

                </div>

            </div>

            <EditGroupModal
                isOpen={editingField !== null}
                title={
                    editingField === "name"
                        ? "Edit Group Name"
                        : "Edit Description"
                }
                label={
                    editingField === "name"
                        ? "Group Name"
                        : "Description"
                }
                initialValue={
                    editingField === "name"
                        ? group.name
                        : group.description ?? ""
                }
                multiline={
                    editingField === "description"
                }
                loading={updateGroupMutation.isPending}
                onClose={() =>
                    setEditingField(null)
                }
                onSave={handleSave}
            />

        </Modal>
    );
};

export default GroupInfoModal;