import { useRemoveMember } from "../../hooks/useRemoveMember";
import Modal from "../ui/Modal";

interface RemoveMemberModalProps {
    isOpen: boolean;
    onClose: () => void;

    groupId: string;
    groupName: string;

    userId: string;
    username: string;
}

const RemoveMemberModal = ({
    isOpen,
    onClose,

    groupId,
    groupName,

    userId,
    username,
}: RemoveMemberModalProps) => {

    const removeMemberMutation =
        useRemoveMember();

    const handleRemove = () => {

        removeMemberMutation.mutate(
            {
                groupId,
                userId,
            },
            {
                onSuccess: () => {

                    onClose();

                },
            }
        );

    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Remove Member"
            className="max-w-lg"
        >

            <div className="space-y-6">

                <div>

                    <p className="text-base text-white">

                        Remove{" "}

                        <span className="font-semibold">

                            {username}

                        </span>

                        {" "}from{" "}

                        <span className="font-semibold">

                            {groupName}

                        </span>

                        ?

                    </p>

                    <p className="mt-3 text-sm text-[#8696a0]">

                        This member will immediately lose access to
                        the group, its messages and future updates.
                        They can only join again if invited.

                    </p>

                </div>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={removeMemberMutation.isPending}
                        className="rounded-lg border border-[#2a3942] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2a3942]"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleRemove}
                        disabled={removeMemberMutation.isPending}
                        className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {removeMemberMutation.isPending
                            ? "Removing..."
                            : "Remove"}

                    </button>

                </div>

            </div>

        </Modal>
    );

};

export default RemoveMemberModal;