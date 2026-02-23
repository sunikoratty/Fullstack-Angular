import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      <Sidebar />

      <div className="flex-grow-1">
        <Header />
        <div className="p-4 bg-light" style={{ minHeight: "calc(100vh - 60px)" }}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;