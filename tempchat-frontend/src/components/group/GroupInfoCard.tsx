import { Pencil } from "lucide-react";

interface GroupInfoCardProps {
    label: string;
    value: string;
    editable?: boolean;
    onEdit?: () => void;
}

const GroupInfoCard = ({
    label,
    value,
    editable = false,
    onEdit,
}: GroupInfoCardProps) => {
    return (
        <div className="rounded-xl bg-[#111b21]">

            <div className="flex items-center justify-between border-b border-[#2a3942] px-5 py-3">

                <h3 className="text-sm font-medium uppercase tracking-wide text-[#00a884]">
                    {label}
                </h3>

                {editable && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="rounded-lg p-2 text-[#8696a0] transition hover:bg-[#202c33] hover:text-white"
                    >
                        <Pencil size={18} />
                    </button>
                )}

            </div>

            <div className="px-5 py-4">

                <p className="whitespace-pre-wrap wrap-break-word leading-7 text-[#d1d7db]">
                    {value}
                </p>

            </div>

        </div>
    );
};

export default GroupInfoCard;