import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function ProfileLayout() {
  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-24 lg:pt-28 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* Sidebar - proper column on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Sidebar />
          </div>

          {/* Content area */}
          <div className="min-h-[600px] w-full overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
