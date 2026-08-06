import {
    EllipsisVertical,
    ShieldMinus,
    ShieldPlus,
    UserRoundX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MemberActionMenuProps {
    loading?: boolean;

    canPromote: boolean;
    canDemote: boolean;
    canRemove: boolean;

    onPromote?: () => void;
    onDemote?: () => void;
    onRemove?: () => void;
}

const MemberActionMenu = ({
    loading = false,

    canPromote,
    canDemote,
    canRemove,

    onPromote,
    onDemote,
    onRemove,
}: MemberActionMenuProps) => {

    const [open, setOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    if (
        !canPromote &&
        !canDemote &&
        !canRemove
    ) {
        return null;
    }

    return (
        <div
            ref={menuRef}
            className="relative"
        >

            <button
                onClick={() => setOpen(!open)}
                className="rounded-full p-2 transition hover:bg-[#2a3942]"
                disabled={loading}
            >
                <EllipsisVertical
                    size={18}
                    className="text-[#8696a0]"
                />
            </button>

            {open && (

                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#2a3942] bg-[#202c33] shadow-2xl">

                    {canPromote && (

                        <button
                            onClick={() => {

                                setOpen(false);

                                onPromote?.();

                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white transition hover:bg-[#2a3942]"
                        >

                            <ShieldPlus
                                size={18}
                                className="text-[#00a884]"
                            />

                            Make Admin

                        </button>

                    )}

                    {canDemote && (

                        <button
                            onClick={() => {

                                setOpen(false);

                                onDemote?.();

                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white transition hover:bg-[#2a3942]"
                        >

                            <ShieldMinus
                                size={18}
                                className="text-[#f59e0b]"
                            />

                            Make Member

                        </button>

                    )}

                    {canRemove && (

                        <button
                            onClick={() => {

                                setOpen(false);

                                onRemove?.();

                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 transition hover:bg-[#2a3942]"
                        >

                            <UserRoundX
                                size={18}
                            />

                            Remove Member

                        </button>

                    )}

                </div>

            )}

        </div>
    );

};

export default MemberActionMenu;