import ChatList from "../chat/ChatList";
import SearchBox from "../chat/SearchBox";
import SidebarHeader from "../chat/SidebarHeader";

const Sidebar = () => {
  return (
      <aside className="w-[380px] border-r border-[#2a3942] bg-[#111b21]">
          <SidebarHeader/>

          <SearchBox/>

          <ChatList/>
      </aside>
  );
};

export default Sidebar;