import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import Modal from "../ui/Modal";

import {
    createGroupSchema,
    type CreateGroupFormData,
} from "../../schema/group.schema";

import { useCreateGroup } from "../../hooks/useCreateGroup";
import type { CreatedGroup } from "../../types/group.types";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGroupCreated: (group: CreatedGroup) => void;
}

const CreateGroupModal = ({
    isOpen,
    onClose,
    onGroupCreated,
}: CreateGroupModalProps) => {
    const [durationOption, setDurationOption] = useState("24");

    const createGroupMutation = useCreateGroup();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateGroupFormData>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
            description: "",
            duration: 24,
        },
    });

    const customDuration = watch("duration");

    const onSubmit = async (data: CreateGroupFormData) => {
        try {
            const duration =
                durationOption === "custom"
                    ? data.duration
                    : Number(durationOption);

            const response = await createGroupMutation.mutateAsync({
                ...data,
                duration,
            });

            reset({
                name: "",
                description: "",
                duration: 24,
            });

            setDurationOption("24");

            onClose();

            onGroupCreated(response.group);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Failed to create group"
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Temporary Group"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                {/* Group Name */}

                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        Group Name
                    </label>

                    <input
                        {...register("name")}
                        className="w-full rounded-lg border border-[#2a3942] bg-[#111b21] px-3 py-2 text-white outline-none focus:border-[#00a884]"
                        placeholder="Weekend Trip"
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Description */}

                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        Description
                    </label>

                    <textarea
                        {...register("description")}
                        rows={3}
                        className="w-full rounded-lg border border-[#2a3942] bg-[#111b21] px-3 py-2 text-white outline-none focus:border-[#00a884]"
                        placeholder="Optional description..."
                    />

                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Duration */}

                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        Duration
                    </label>

                    <select
                        value={durationOption}
                        onChange={(e) => {
                            const value = e.target.value;

                            setDurationOption(value);

                            if (value !== "custom") {
                                setValue(
                                    "duration",
                                    Number(value)
                                );
                            }
                        }}
                        className="w-full rounded-lg border border-[#2a3942] bg-[#111b21] px-3 py-2 text-white outline-none focus:border-[#00a884]"
                    >
                        <option value="1">1 Hour</option>
                        <option value="6">6 Hours</option>
                        <option value="12">12 Hours</option>
                        <option value="24">24 Hours</option>
                        <option value="custom">
                            Custom
                        </option>
                    </select>
                </div>

                {/* Custom Duration */}

                {durationOption === "custom" && (
                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Custom Duration (Hours)
                        </label>

                        <input
                            type="number"
                            min={1}
                            max={168}
                            {...register("duration", {
                                valueAsNumber: true,
                            })}
                            className="w-full rounded-lg border border-[#2a3942] bg-[#111b21] px-3 py-2 text-white outline-none focus:border-[#00a884]"
                            placeholder="Enter hours"
                        />

                        {errors.duration && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.duration.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Footer */}

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-[#2a3942] px-4 py-2 text-white transition hover:bg-[#37474f]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={createGroupMutation.isPending}
                        className="rounded-lg bg-[#00a884] px-4 py-2 font-medium text-white transition hover:bg-[#02bd94] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {createGroupMutation.isPending
                            ? "Creating..."
                            : "Create Group"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateGroupModal;