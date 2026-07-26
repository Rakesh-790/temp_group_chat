import { useState } from "react";
import ChatList from "../chat/ChatList";
import SearchBox from "../chat/SearchBox";
import SidebarHeader from "../chat/SidebarHeader";

export type SortType = "newest" | "oldest" | "alphabetical";

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortType>("newest");

    return (
        <aside className="w-95 border-r border-[#2a3942] bg-[#111b21]">
            <SidebarHeader
                sort={sort}
                setSort={setSort}
            />

            <SearchBox
                search={search}
                setSearch={setSearch}
            />

            <ChatList search={search} sort={sort} />
        </aside>
    );
};

export default Sidebar;