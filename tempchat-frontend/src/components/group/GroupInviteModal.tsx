import { CheckCircle2, Copy } from "lucide-react";
import { toast } from "react-hot-toast";

import Modal from "../ui/Modal";
import type { CreatedGroup } from "../../types/group.types";

interface GroupInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: CreatedGroup | null;
}

const GroupInviteModal = ({
    isOpen,
    onClose,
    group,
}: GroupInviteModalProps) => {
    if (!group) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(group.inviteCode);
            toast.success("Invite code copied!");
        } catch {
            toast.error("Failed to copy invite code");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
        >
            <div className="space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2
                            size={42}
                            className="text-green-600"
                        />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Group Created!
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Share this invite code with your friends so they can
                        join your temporary group.
                    </p>
                </div>

                {/* Invite Code */}
                <div>
                    <p className="mb-2 text-sm font-medium text-gray-600">
                        Invite Code
                    </p>

                    <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-green-300 bg-green-50 px-4 py-4">
                        <span className="font-mono text-lg font-bold tracking-wider text-gray-800">
                            {group.inviteCode}
                        </span>

                        <button
                            onClick={handleCopy}
                            className="rounded-lg bg-green-600 p-2 text-white transition hover:bg-green-700"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                {/* Group Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Group
                        </p>

                        <p className="mt-2 truncate font-semibold text-gray-800">
                            {group.name}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Expires
                        </p>

                        <p className="mt-2 text-sm font-semibold text-gray-800">
                            {new Date(group.expiresAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default GroupInviteModal;