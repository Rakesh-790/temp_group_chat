import { AlertTriangle } from "lucide-react";

import Modal from "../ui/Modal";

import type { Group } from "../../types/group.types";
import { useDeleteGroup } from "../../hooks/group/useDeleteGroup";

interface DeleteGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group | null;
}

const DeleteGroupModal = ({
    isOpen,
    onClose,
    group,
}: DeleteGroupModalProps) => {
    const { mutate: deleteGroup, isPending } = useDeleteGroup();

    if (!group) return null;

    const handleDelete = () => {
        deleteGroup(group._id, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
        >
            <div className="space-y-6">
                {/* Warning Icon */}
                <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                        <AlertTriangle
                            size={42}
                            className="text-red-500"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white">
                        Delete Group?
                    </h2>

                    <p className="mt-2 text-sm text-[#8696a0]">
                        This action will permanently delete
                        <span className="font-medium text-white">
                            {" "}
                            {group.name}
                        </span>
                        .
                    </p>

                    <p className="mt-1 text-sm text-[#8696a0]">
                        This action cannot be undone.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 rounded-lg border border-[#2a3942] py-3 font-medium text-white transition hover:bg-[#2a3942]"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex-1 rounded-lg bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteGroupModal;