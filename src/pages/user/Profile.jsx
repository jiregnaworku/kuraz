import { useLocation, Link, Outlet } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaShoppingBag,
  FaCommentDots,
  FaBars,
  FaBell,
  FaTimes,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useState } from "react";

import Sidebar from "../../components/profile/Sidebar";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only true on /profile, not /profile/orders etc.
  const isMainProfile = location.pathname === "/profile";

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/profile") return "Dashboard";
    if (path === "/profile/orders") return "My Orders";
    if (path === "/profile/messages") return "Messages";
    if (path === "/profile/notifications") return "Notifications";
    if (path === "/profile/settings") return "Settings";
    return "";
  };

  // Get page icon based on route
  const getPageIcon = () => {
    const path = location.pathname;
    if (path === "/profile") return <FaUser className="text-[#d4af37]" />;
    if (path === "/profile/orders")
      return <FaShoppingBag className="text-[#d4af37]" />;
    if (path === "/profile/messages")
      return <FaCommentDots className="text-[#d4af37]" />;
    if (path === "/profile/notifications")
      return <FaBell className="text-[#d4af37]" />;
    if (path === "/profile/settings")
      return <FaCog className="text-[#d4af37]" />;
    return null;
  };

  return (
    <section
      className="
      min-h-screen
      bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),_transparent_35%),linear-gradient(135deg,_#f8f4eb_0%,_#fcfbf8_45%,_#eef3ee_100%)]
      relative
      overflow-hidden
      "
    >
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 rounded-full bg-[#24312c]/5 blur-3xl"></div>

      {/* Back to Home Button - Mobile only */}
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6 lg:hidden">
        <Link
          to="/#home"
          className="
            group flex items-center gap-2 rounded-full 
            border border-white/70 bg-white/85 px-4 py-2 text-sm font-medium 
            text-[#24312c] shadow-[0_10px_30px_rgba(36,49,44,0.12)] backdrop-blur-md
            transition-all duration-300 hover:bg-white 
            hover:shadow-[0_14px_40px_rgba(36,49,44,0.16)] hover:scale-105
            sm:px-5 sm:py-2.5 sm:text-base
          "
        >
          <FaHome className="text-[#d4af37] transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline">Home</span>
          <span className="sm:hidden">
            <IoMdArrowBack className="text-[#d4af37]" />
          </span>
        </Link>
      </div>

      {/* Back to Home Button - Desktop only */}
      <div className="absolute left-6 top-6 z-10 hidden lg:block">
        <Link
          to="/#home"
          className="
            group flex items-center gap-2 rounded-full 
            border border-white/70 bg-white/85 px-5 py-2.5 text-sm font-medium 
            text-[#24312c] shadow-[0_10px_30px_rgba(36,49,44,0.12)] backdrop-blur-md
            transition-all duration-300 hover:bg-white 
            hover:shadow-[0_14px_40px_rgba(36,49,44,0.16)] hover:scale-105
          "
        >
          <FaHome className="text-[#d4af37] transition-transform duration-300 group-hover:scale-110" />
          <span>Home</span>
        </Link>
      </div>

      {/* Mobile Hamburger Menu Button */}
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="
            group flex items-center gap-2 rounded-full 
            border border-white/70 bg-white/85 px-4 py-2 text-sm font-medium 
            text-[#24312c] shadow-[0_10px_30px_rgba(36,49,44,0.12)] backdrop-blur-md
            transition-all duration-300 hover:bg-white 
            hover:shadow-[0_14px_40px_rgba(36,49,44,0.16)] hover:scale-105
          "
        >
          {mobileMenuOpen ? (
            <>
              <FaTimes className="text-[#d4af37] text-lg" />
              <span>Close</span>
            </>
          ) : (
            <>
              <FaBars className="text-[#d4af37] text-lg" />
              <span>Menu</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu - Slides from Right */}
      <div
        className={`
          fixed right-0 top-0 z-40 h-full w-80 transform bg-white shadow-2xl 
          transition-transform duration-300 ease-in-out lg:hidden
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Menu Header */}
          <div className="relative border-b border-gray-100 p-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-[#d4af37] transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#b88f1d] text-3xl text-white shadow-lg">
                <FaUser />
              </div>
              <div>
                <h3 className="font-bold text-[#24312c]">
                  {user?.fullName || "Customer"}
                </h3>
                <p className="text-sm text-gray-500">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 
                transition-all duration-200
                ${
                  location.pathname === "/profile"
                    ? "bg-[#d4af37] text-white shadow-lg"
                    : "text-[#24312c] hover:bg-[#f8f4eb] hover:text-[#d4af37]"
                }
              `}
            >
              <FaUser className="text-lg" />
              <span className="font-medium">Profile</span>
              {location.pathname === "/profile" && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </Link>

            {/* My Orders */}
            <Link
              to="/profile/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 
                transition-all duration-200
                ${
                  location.pathname === "/profile/orders"
                    ? "bg-[#d4af37] text-white shadow-lg"
                    : "text-[#24312c] hover:bg-[#f8f4eb] hover:text-[#d4af37]"
                }
              `}
            >
              <FaShoppingBag className="text-lg" />
              <span className="font-medium">My Orders</span>
              {location.pathname === "/profile/orders" && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </Link>

            {/* Messages */}
            <Link
              to="/profile/messages"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 
                transition-all duration-200
                ${
                  location.pathname === "/profile/messages"
                    ? "bg-[#d4af37] text-white shadow-lg"
                    : "text-[#24312c] hover:bg-[#f8f4eb] hover:text-[#d4af37]"
                }
              `}
            >
              <FaCommentDots className="text-lg" />
              <span className="font-medium">Messages</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            </Link>

            {/* Notifications */}
            <Link
              to="/profile/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 
                transition-all duration-200
                ${
                  location.pathname === "/profile/notifications"
                    ? "bg-[#d4af37] text-white shadow-lg"
                    : "text-[#24312c] hover:bg-[#f8f4eb] hover:text-[#d4af37]"
                }
              `}
            >
              <FaBell className="text-lg" />
              <span className="font-medium">Notifications</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                5
              </span>
            </Link>

            {/* Settings */}
            <Link
              to="/profile/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 
                transition-all duration-200
                ${
                  location.pathname === "/profile/settings"
                    ? "bg-[#d4af37] text-white shadow-lg"
                    : "text-[#24312c] hover:bg-[#f8f4eb] hover:text-[#d4af37]"
                }
              `}
            >
              <FaCog className="text-lg" />
              <span className="font-medium">Settings</span>
            </Link>

            {/* Divider */}
            <div className="my-4 border-t border-gray-100"></div>

            {/* Logout Button */}
            <button
              onClick={() => {
                const confirmLogout = window.confirm(
                  "Are you sure you want to logout?",
                );
                if (confirmLogout) {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setMobileMenuOpen(false);
                  window.location.href = "/signin";
                }
              }}
              className="
                flex w-full items-center gap-4 rounded-xl px-4 py-3 
                text-red-500 transition-all duration-200
                hover:bg-red-50 hover:text-red-600
              "
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-100 p-4">
            <p className="text-center text-xs text-gray-400">
              © 2026 Your Store
            </p>
          </div>
        </div>
      </div>

      <div
        className="
        mx-auto
        flex
        max-w-7xl
        flex-col
        gap-5
        px-4
        pt-20
        pb-5

        sm:px-6
        sm:pt-24
        lg:flex-row
        lg:px-8
        lg:pt-10
        lg:pb-10
        "
      >
        {/* Main Content - Now on the Left */}
        <main
          className="
          min-h-[80vh]
          flex-1
          overflow-hidden
          rounded-[2rem]
          border
          border-white/30
          bg-white/55
          p-4
          shadow-[0_24px_80px_rgba(36,49,44,0.12)]
          backdrop-blur-2xl

          sm:p-6
          lg:p-8
          lg:order-1
          "
        >
          {/* Page Header - Show on all pages except main profile */}
          {!isMainProfile && (
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f4eb] text-lg">
                {getPageIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#24312c]">
                  {getPageTitle()}
                </h2>
                <p className="text-xs text-gray-500">
                  {getPageTitle()} / Profile
                </p>
              </div>
            </div>
          )}

          {/* Dashboard Home Only */}
          {isMainProfile ? (
            <>
              {/* Welcome Section with Decorative Elements - Added mt-2 for spacing */}
              <div className="relative mb-8 mt-2 overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#24312c] via-[#2f3c36] to-[#435049] p-5 shadow-xl sm:p-7 lg:mb-7">
                {/* Decorative Circles */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-20 h-48 w-48 rounded-full bg-[#d4af37]/5 blur-2xl"></div>

                <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div
                    className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br from-[#d4af37] to-[#b88f1d]
                    text-3xl
                    text-white
                    shadow-lg
                    ring-4
                    ring-[#d4af37]/20
                    "
                  >
                    <FaUser />
                  </div>

                  <div className="flex-1">
                    <h1
                      className="
                        text-2xl
                      font-bold
                      text-white
                        sm:text-3xl
                      "
                    >
                      Welcome back, {user?.fullName || "Customer"}! 👋
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
                      Manage your account, orders and messages from here.
                    </p>
                  </div>

                  {/* Decorative Icon */}
                  <div className="hidden text-6xl text-white/10 sm:block">
                    ✦
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  icon={<FaUser className="text-[#d4af37]" />}
                  title="Full Name"
                  value={user?.fullName}
                  gradient="from-[#24312c] to-[#3a4a42]"
                />

                <InfoCard
                  icon={<FaEnvelope className="text-[#d4af37]" />}
                  title="Email Address"
                  value={user?.email}
                  gradient="from-[#d4af37] to-[#b88f1d]"
                />

                <InfoCard
                  icon={<FaPhone className="text-[#d4af37]" />}
                  title="Phone Number"
                  value={user?.phone || "Not added"}
                  gradient="from-[#24312c] to-[#3a4a42]"
                />

                <InfoCard
                  icon={<FaMapMarkerAlt className="text-[#d4af37]" />}
                  title="Shipping Address"
                  value={user?.address || "Not added"}
                  gradient="from-[#d4af37] to-[#b88f1d]"
                />
              </div>
            </>
          ) : (
            /* Child Routes - Orders, Messages, Notifications, Settings */
            <div className="space-y-4">
              <Outlet />
            </div>
          )}
        </main>

        {/* Sidebar - Now on the Right (Desktop Only) */}
        <aside
          className="
          hidden
          w-full
          lg:sticky
          lg:top-6
          lg:w-[290px]
          lg:self-start
          lg:block
          lg:order-2
          "
        >
          <Sidebar />
        </aside>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, value, gradient }) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-[1.5rem]
      border
      border-white/70
      bg-white/90
      p-5
      shadow-[0_12px_40px_rgba(36,49,44,0.08)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      hover:border-[#d4af37]/20
      "
    >
      {/* Gradient Background on Hover */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${gradient} 
          opacity-0 transition-opacity duration-300 group-hover:opacity-[0.03]
        `}
      ></div>

      <div
        className="
        mb-4
        flex
        items-center
        gap-3
        "
      >
        <div
          className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          bg-[#f8f4eb]
          text-lg
          transition-all
          duration-300
          group-hover:bg-[#d4af37]/10
          group-hover:scale-110
          "
        >
          {icon}
        </div>

        <h3
          className="
          text-sm
          font-semibold
          text-[#24312c]
          "
        >
          {title}
        </h3>
      </div>

      <p className="break-words text-sm leading-6 text-gray-600 group-hover:text-[#24312c] transition-colors duration-300">
        {value || "Not available"}
      </p>

      {/* Decorative Bottom Line */}
      <div className="mt-3 h-0.5 w-0 bg-gradient-to-r from-[#d4af37] to-[#b88f1d] transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
}
