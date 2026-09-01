import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import Modal from "../ui/Modal";

import {
    joinGroupSchema,
    type JoinGroupFormData,
} from "../../validation/group.validation";

import { useJoinGroup } from "../../hooks/useJoinGroup";

interface JoinGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const JoinGroupModal = ({
    isOpen,
    onClose,
}: JoinGroupModalProps) => {

    const joinGroupMutation = useJoinGroup();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<JoinGroupFormData>({
        resolver: zodResolver(joinGroupSchema),
        defaultValues: {
            inviteCode: "",
        },
    });

    const onSubmit = async (data: JoinGroupFormData) => {
        try {
            const response = await joinGroupMutation.mutateAsync(data);

            toast.success(response.message);

            reset();

            onClose();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Failed to join group"
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Join Group"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        Invite Code
                    </label>

                    <input
                        {...register("inviteCode")}
                        placeholder="tempchat-xxxxxxxx"
                        className="w-full rounded-lg border border-[#2a3942] bg-[#111b21] px-3 py-2 text-white outline-none focus:border-[#00a884]"
                    />

                    {errors.inviteCode && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.inviteCode.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-[#2a3942] px-4 py-2 text-white hover:bg-[#37474f]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={joinGroupMutation.isPending}
                        className="rounded-lg bg-[#00a884] px-4 py-2 font-medium text-white hover:bg-[#02bd94] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {joinGroupMutation.isPending
                            ? "Joining..."
                            : "Join Group"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default JoinGroupModal;