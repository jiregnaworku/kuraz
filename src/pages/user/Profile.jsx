import { Outlet, useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

import Sidebar from "../../components/profile/Sidebar";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const location = useLocation();

  // Only true on /profile, not /profile/orders etc.
  const isMainProfile = location.pathname === "/profile";

  return (
    <section
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#f8f4eb]
      via-[#fcfbf8]
      to-[#e8d8aa]
      "
    >
      <div
        className="
        mx-auto
        flex
        max-w-7xl
        flex-col
        gap-6
        px-4
        py-6

        sm:px-6
        lg:flex-row
        lg:px-8
        lg:py-8
        "
      >
        {/* Sidebar */}

        <aside
          className="
          w-full
          lg:sticky
          lg:top-6
          lg:w-[290px]
          lg:self-start
          "
        >
          <Sidebar />
        </aside>

        {/* Main Content */}

        <main
          className="
          min-h-[80vh]
          flex-1
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/25
          p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          backdrop-blur-xl

          sm:p-7
          lg:p-8
          "
        >
          {/* Dashboard Home Only */}

          {isMainProfile && (
            <>
              <div
                className="
                mb-8
                flex
                flex-col
                gap-5

                sm:flex-row
                sm:items-center
                "
              >
                <div
                  className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-[#24312c]
                  text-4xl
                  text-[#d4af37]
                  shadow-lg
                  "
                >
                  <FaUser />
                </div>

                <div>
                  <h1
                    className="
                    text-3xl
                    font-bold
                    text-[#24312c]
                    "
                  >
                    Welcome, {user?.fullName || "Customer"}
                  </h1>

                  <p className="mt-2 text-gray-500">
                    Manage your account, orders and messages.
                  </p>
                </div>
              </div>

              {/* User Information */}

              <div
                className="
                grid
                gap-5
                md:grid-cols-2
                "
              >
                <InfoCard
                  icon={<FaUser />}
                  title="Full Name"
                  value={user?.fullName}
                />

                <InfoCard
                  icon={<FaEnvelope />}
                  title="Email"
                  value={user?.email}
                />

                <InfoCard
                  icon={<FaPhone />}
                  title="Phone"
                  value={user?.phone || "Not added"}
                />

                <InfoCard
                  icon={<FaMapMarkerAlt />}
                  title="Address"
                  value={user?.address || "Not added"}
                />
              </div>
            </>
          )}

          {/* Child Pages */}

          <Outlet />
        </main>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-gray-100
      bg-white/100
      p-5
      shadow-sm
      transition
      hover:-translate-y-1
      hover:shadow-md
      "
    >
      <div
        className="
        mb-3
        flex
        items-center
        gap-3
        text-[#d4af37]
        "
      >
        {icon}

        <h3
          className="
          font-semibold
          text-[#24312c]
          "
        >
          {title}
        </h3>
      </div>

      <p className="break-words text-gray-600">{value || "Not available"}</p>
    </div>
  );
}
