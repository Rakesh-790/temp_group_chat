import { Pencil } from "lucide-react";

interface ProfileInfoCardProps {
    label: string;
    value: string;
    editable?: boolean;
    onEdit?: () => void;
}

const ProfileInfoCard = ({
    label,
    value,
    editable = false,
    onEdit,
}: ProfileInfoCardProps) => {
    return (
        <div className="rounded-lg bg-[#202c33] p-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-[#8696a0]">
                    {label}
                </span>

                {editable && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="text-[#8696a0] transition hover:text-white"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            <p className="text-white">
                {value}
            </p>
        </div>
    );
};

export default ProfileInfoCard;