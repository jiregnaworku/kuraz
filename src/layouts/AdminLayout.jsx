import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <AdminNavbar />

      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
}
