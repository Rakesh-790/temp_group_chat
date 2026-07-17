import { Outlet } from "react-router-dom";
import Navbar from "../layout/navbar";
import Sidebar from "../layout/sidebar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />

      <div>
        <Sidebar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;