import { Search } from "lucide-react";

const SearchBox = () => {
    return (
        <div className="border-b border-[#2a3942] bg-[#111b21] p-3">
            <div className="flex items-center gap-3 rounded-lg bg-[#202c33] px-4 py-2">
                <Search
                    size={18}
                    className="text-[#8696a0]"
                />

                <input
                    type="text"
                    placeholder="Search or start new chat"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#8696a0]"
                />
            </div>
        </div>
    );
};

export default SearchBox;