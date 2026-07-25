import { useEffect, useState } from "react";
import Modal from "../ui/Modal";


interface EditProfileModalProps {
    isOpen: boolean;
    title: string;
    label: string;
    initialValue: string;
    loading?: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
}

const EditProfileModal = ({
    isOpen,
    title,
    label,
    initialValue,
    loading = false,
    onClose,
    onSave,
}: EditProfileModalProps) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [initialValue, isOpen]);

    const handleSave = () => {
        const trimmedValue = value.trim();

        if (!trimmedValue) return;

        onSave(trimmedValue);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="space-y-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[#8696a0]">
                        {label}
                    </label>

                    <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                            setValue(e.target.value)
                        }
                        className="w-full rounded-lg border border-[#2a3942] bg-[#111b21] px-4 py-3 text-white outline-none transition focus:border-[#00a884]"
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-[#8696a0] transition hover:bg-[#2a3942] hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={loading || !value.trim()}
                        onClick={handleSave}
                        className="rounded-lg bg-[#00a884] px-5 py-2 font-medium text-white transition hover:bg-[#02c39a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditProfileModal;