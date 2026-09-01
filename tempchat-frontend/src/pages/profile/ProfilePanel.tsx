import { useState } from "react";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileInfoCard from "../../components/profile/ProfileInfoCard";
import EditProfileModal from "../../components/profile/EditProfileModal";
import { useProfile } from "../../hooks/profile/useProfile";
import { useUploadAvatar } from "../../hooks/profile/useUploadAvatar";
import { useUpdateProfile } from "../../hooks/profile/useUpdateProfile";


const ProfilePanel = () => {
    const { data: profile, isLoading, error } = useProfile();

    const uploadAvatarMutation = useUploadAvatar();
    const updateProfileMutation = useUpdateProfile();

    const [editingField, setEditingField] = useState<
        "username" | "bio" | null
    >(null);

    const handleAvatarSelect = (file: File) => {
        uploadAvatarMutation.mutate(file);
    };

    const handleProfileSave = (value: string) => {
        if (!profile || !editingField) return;

        updateProfileMutation.mutate({
            username:
                editingField === "username"
                    ? value
                    : profile.username,

            bio:
                editingField === "bio"
                    ? value
                    : profile.bio ?? "",
        });

        setEditingField(null);
    };

    if (isLoading) {
        return (
            <aside className="w-95 border-r border-[#2a3942] bg-[#111b21]">
                <div className="flex h-full items-center justify-center">
                    <p className="text-[#8696a0]">Loading...</p>
                </div>
            </aside>
        );
    }

    if (error || !profile) {
        return (
            <aside className="w-95 border-r border-[#2a3942] bg-[#111b21]">
                <div className="flex h-full items-center justify-center">
                    <p className="text-red-400">
                        Failed to load profile.
                    </p>
                </div>
            </aside>
        );
    }

    return (
        <>
            <aside className="w-95 border-r border-[#2a3942] bg-[#111b21]">
                <div className="h-full overflow-y-auto p-6">
                    <h1 className="mb-8 text-center text-2xl font-semibold text-white">
                        My Profile
                    </h1>

                    <ProfileAvatar
                        username={profile.username}
                        avatar={profile.avatar?.url ?? null}
                        onFileSelect={handleAvatarSelect}
                    />

                    <div className="mt-10 space-y-6">
                        <ProfileInfoCard
                            label="Username"
                            value={profile.username}
                            editable
                            onEdit={() => setEditingField("username")}
                        />

                        <ProfileInfoCard
                            label="Bio"
                            value={profile.bio || "No bio yet"}
                            editable
                            onEdit={() => setEditingField("bio")}
                        />

                        <ProfileInfoCard
                            label="Email"
                            value={profile.email}
                        />
                    </div>
                </div>
            </aside>

            <EditProfileModal
                isOpen={editingField !== null}
                title={
                    editingField === "username"
                        ? "Edit Username"
                        : "Edit Bio"
                }
                label={
                    editingField === "username"
                        ? "Username"
                        : "Bio"
                }
                initialValue={
                    editingField === "username"
                        ? profile.username
                        : profile.bio ?? ""
                }
                loading={updateProfileMutation.isPending}
                onClose={() => setEditingField(null)}
                onSave={handleProfileSave}
            />
        </>
    );
};

export default ProfilePanel;