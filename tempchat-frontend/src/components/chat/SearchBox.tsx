import { Search } from "lucide-react";

interface SearchBoxProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBox = ({
    search,
    setSearch,
}: SearchBoxProps) => {
    return (
        <div className="border-b border-[#2a3942] bg-[#111b21] p-3">
            <div className="flex items-center gap-3 rounded-lg bg-[#202c33] px-4 py-2">
                <Search
                    size={18}
                    className="text-[#8696a0]"
                />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search for groups"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#8696a0]"
                />
            </div>
        </div>
    );
};

export default SearchBox;