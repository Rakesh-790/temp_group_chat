import { Camera, Pencil } from "lucide-react";
import { useRef } from "react";

interface GroupAvatarProps {
    groupName: string;
    avatar?: string | null;
    editable?: boolean;
    loading?: boolean;
    onFileSelect?: (file: File) => void;
}

const GroupAvatar = ({
    groupName,
    avatar,
    editable = false,
    loading = false,
    onFileSelect,
}: GroupAvatarProps) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasAvatar = !!avatar;

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        onFileSelect?.(file);

        e.target.value = "";
    };

    return (
        <div className="flex flex-col items-center">

            <div className="relative">

                {hasAvatar ? (
                    <div className="h-36 w-36 overflow-hidden rounded-full">
                        <img
                            src={avatar}
                            alt={groupName}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                ) : (
                    <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#54656f] text-5xl font-bold text-white">
                        {groupName.charAt(0).toUpperCase()}
                    </div>
                )}

                {editable && (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] text-white shadow-lg transition hover:bg-[#02c39a] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {hasAvatar ? (
                                <Pencil size={18} />
                            ) : (
                                <Camera size={18} />
                            )}
                        </button>
                    </>
                )}

            </div>

        </div>
    );
};

export default GroupAvatar;