import { Outlet } from "react-router-dom";

import Sidebar from "../../components/profile/Sidebar";

export default function Profile() {
  return (
    <section
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#f7f2e8]
      via-white
      to-[#e8d8aa]
      px-5
      pb-20
      pt-32
      "
    >
      <div
        className="
        mx-auto
        flex
        max-w-7xl
        gap-6
        "
      >
        {/* SIDEBAR */}

        <Sidebar />

        {/* CONTENT */}

        <main
          className="
          flex-1
          "
        >
          <Outlet />
        </main>
      </div>
    </section>
  );
}
