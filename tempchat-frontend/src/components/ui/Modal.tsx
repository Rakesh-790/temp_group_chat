import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    className = "max-w-md",
}: ModalProps) => {

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className={`flex max-h-[90vh] w-full flex-col rounded-xl bg-[#202c33] shadow-xl ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between border-b border-[#2a3942] px-5 py-4">
                        <h2 className="text-lg font-semibold text-white">
                            {title}
                        </h2>

                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-[#8696a0] transition hover:bg-[#2a3942] hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;