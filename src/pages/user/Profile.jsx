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
import { useState, useEffect } from "react";

import Sidebar from "../../components/profile/Sidebar";
import ConfirmModal from "../../components/profile/ConfirmModal";
import { getNotifications } from "../../api/notificationApi";
import { useLanguage } from "../../context/LanguageContext";

export default function Profile() {
  const { t } = useLanguage();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Add state for unread counts
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Only true on /profile, not /profile/orders etc.
  const isMainProfile = location.pathname === "/profile";

  // Fetch unread counts for mobile menu
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !currentUser) {
        setUnreadNotifications(0);
        setUnreadMessages(0);
        return;
      }

      try {
        const response = await getNotifications();

        let notificationsList = [];
        if (response?.notifications) {
          notificationsList = response.notifications;
        } else if (response?.data) {
          notificationsList = response.data;
        } else if (Array.isArray(response)) {
          notificationsList = response;
        }

        const currentUserId = currentUser._id || currentUser.id;

        // Filter for current user
        const userNotifications = notificationsList.filter((n) => {
          if (!n) return false;
          const notificationUserId =
            n.user?._id ||
            n.user?.id ||
            n.userId ||
            n.recipient?._id ||
            n.recipient?.id ||
            n.recipientId;

          if (!notificationUserId) return true;
          return notificationUserId.toString() === currentUserId.toString();
        });

        const unreadNotifs = userNotifications.filter(
          (n) => n && !n.isRead,
        ).length;

        setUnreadNotifications(unreadNotifs);

        // If you have messages API, fetch unread messages count here
        setUnreadMessages(0); // Replace with actual messages count
      } catch (error) {
        console.error("Error fetching notification count:", error);
        setUnreadNotifications(0);
        setUnreadMessages(0);
      }
    };

    fetchUnreadCounts();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCounts, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/profile") return t("profile.dashboard") || "Dashboard";
    if (path === "/profile/orders") return t("profile.myOrders") || "My Orders";
    if (path === "/profile/messages")
      return t("profile.messages") || "Messages";
    if (path === "/profile/notifications")
      return t("profile.notifications") || "Notifications";
    if (path === "/profile/settings")
      return t("profile.settings") || "Settings";
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
    window.location.href = "/signin";
  };

  return (
    <section
      className="
      min-h-screen
      bg-[#224248]
      relative
      overflow-hidden
      "
    >
      {/* Decorative Elements - Updated to match the new dark background */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d4af37]/5 blur-3xl"></div>
      <div className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 rounded-full bg-[#d4af37]/5 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-3xl"></div>

      {/* Back to Home Button - Mobile only */}
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6 lg:hidden">
        <Link
          to="/#home"
          className="
            group flex items-center gap-2 rounded-full 
            border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium 
            text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md
            transition-all duration-300 hover:bg-white/20 
            hover:shadow-[0_14px_40px_rgba(0,0,0,0.3)] hover:scale-105
            sm:px-5 sm:py-2.5 sm:text-base
          "
        >
          <FaHome className="text-[#d4af37] transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline">{t("nav.home")}</span>
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
            border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium 
            text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md
            transition-all duration-300 hover:bg-white/20 
            hover:shadow-[0_14px_40px_rgba(0,0,0,0.3)] hover:scale-105
          "
        >
          <FaHome className="text-[#d4af37] transition-transform duration-300 group-hover:scale-110" />
          <span>{t("nav.home")}</span>
        </Link>
      </div>

      {/* Mobile Hamburger Menu Button */}
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="
            group relative flex items-center gap-2 rounded-full 
            border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium 
            text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md
            transition-all duration-300 hover:bg-white/20 
            hover:shadow-[0_14px_40px_rgba(0,0,0,0.3)] hover:scale-105
          "
        >
          {mobileMenuOpen ? (
            <>
              <FaTimes className="text-[#d4af37] text-lg" />
              <span>{t("profile.close") || "Close"}</span>
            </>
          ) : (
            <>
              <FaBars className="text-[#d4af37] text-lg" />
              <span>{t("profile.menu") || "Menu"}</span>
              {/* Combined badge for mobile menu button */}
              {(unreadNotifications > 0 || unreadMessages > 0) && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadNotifications + unreadMessages > 9
                    ? "9+"
                    : unreadNotifications + unreadMessages}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu - Slides from Right */}
      <div
        className={`
          fixed right-0 top-0 z-40 h-full w-80 transform bg-[#1a3338] shadow-2xl 
          transition-transform duration-300 ease-in-out lg:hidden
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Menu Header */}
          <div className="relative border-b border-white/10 p-6">
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
                <h3 className="font-bold text-white">
                  {user?.fullName || t("profile.customer") || "Customer"}
                </h3>
                <p className="text-sm text-gray-300">
                  {user?.email || t("profile.noEmail") || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Items - FIXED with dynamic badges */}
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
                    : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                }
              `}
            >
              <FaUser className="text-lg" />
              <span className="font-medium">{t("profile.profile")}</span>
              {location.pathname === "/profile" && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {t("profile.active")}
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
                    : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                }
              `}
            >
              <FaShoppingBag className="text-lg" />
              <span className="font-medium">{t("profile.myOrders")}</span>
              {location.pathname === "/profile/orders" && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {t("profile.active")}
                </span>
              )}
            </Link>

            {/* Messages - FIXED: Dynamic badge */}
            <Link
              to="/profile/messages"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 
                transition-all duration-200
                ${
                  location.pathname === "/profile/messages"
                    ? "bg-[#d4af37] text-white shadow-lg"
                    : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                }
              `}
            >
              <FaCommentDots className="text-lg" />
              <span className="font-medium">{t("profile.messages")}</span>
              {unreadMessages > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadMessages > 99
                    ? "99+"
                    : unreadMessages > 9
                      ? "9+"
                      : unreadMessages}
                </span>
              )}
            </Link>

            {/* Notifications - FIXED: Dynamic badge */}
            <Link
              to="/profile/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 
                transition-all duration-200
                ${
                  location.pathname === "/profile/notifications"
                    ? "bg-[#d4af37] text-white shadow-lg"
                    : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                }
              `}
            >
              <FaBell className="text-lg" />
              <span className="font-medium">{t("profile.notifications")}</span>
              {unreadNotifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadNotifications > 99
                    ? "99+"
                    : unreadNotifications > 9
                      ? "9+"
                      : unreadNotifications}
                </span>
              )}
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
                    : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                }
              `}
            >
              <FaCog className="text-lg" />
              <span className="font-medium">{t("profile.settings")}</span>
            </Link>

            {/* Divider */}
            <div className="my-4 border-t border-white/10"></div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="
                flex w-full items-center gap-4 rounded-xl px-4 py-3 
                text-red-400 transition-all duration-200
                hover:bg-red-500/20 hover:text-red-300
              "
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">{t("profile.logout")}</span>
            </button>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="border-t border-white/10 p-4">
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
          border-white/10
          bg-white/10
          p-4
          shadow-[0_24px_80px_rgba(0,0,0,0.2)]
          backdrop-blur-xl

          sm:p-6
          lg:p-8
          lg:order-1
          "
        >
          {/* Page Header - Show on all pages except main profile */}
          {!isMainProfile && (
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
                {getPageIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {getPageTitle()}
                </h2>
                <p className="text-xs text-gray-300">
                  {getPageTitle()} / {t("profile.profile")}
                </p>
              </div>
            </div>
          )}

          {/* Dashboard Home Only */}
          {isMainProfile ? (
            <>
              {/* Welcome Section with Decorative Elements */}
              <div className="relative mb-8 mt-2 overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#1a3338] via-[#224248] to-[#2a5258] p-5 shadow-xl sm:p-7 lg:mb-7">
                {/* Decorative Circles */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d4af37]/5 blur-2xl"></div>
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
                      {t("profile.welcomeBack")},{" "}
                      {user?.fullName || t("profile.customer")}! 👋
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
                      {t("profile.manageAccount")}
                    </p>
                  </div>

                  {/* Decorative Icon */}
                  <div className="hidden text-6xl text-white/5 sm:block">✦</div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  icon={<FaUser className="text-[#d4af37]" />}
                  title={t("profile.fullName") || "Full Name"}
                  value={user?.fullName}
                />

                <InfoCard
                  icon={<FaEnvelope className="text-[#d4af37]" />}
                  title={t("profile.email") || "Email Address"}
                  value={user?.email}
                />

                <InfoCard
                  icon={<FaPhone className="text-[#d4af37]" />}
                  title={t("profile.phone") || "Phone Number"}
                  value={user?.phone || t("profile.notAdded") || "Not added"}
                />

                <InfoCard
                  icon={<FaMapMarkerAlt className="text-[#d4af37]" />}
                  title={t("profile.address") || "Shipping Address"}
                  value={user?.address || t("profile.notAdded") || "Not added"}
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

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        title={t("profile.logoutConfirmTitle") || "Logout Confirmation"}
        message={
          t("profile.logoutConfirmMessage") ||
          "Are you sure you want to logout? You will need to login again to access your account."
        }
        confirmText={t("profile.logout")}
        cancelText={t("common.cancel")}
        type="danger"
        icon={<FaSignOutAlt className="text-3xl text-red-600" />}
      />
    </section>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-[1.5rem]
      border
      border-white/10
      bg-white/10
      p-5
      shadow-[0_12px_40px_rgba(0,0,0,0.15)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      hover:border-[#d4af37]/30
      hover:bg-white/15
      "
    >
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
          bg-white/10
          text-lg
          transition-all
          duration-300
          group-hover:bg-[#d4af37]/20
          group-hover:scale-110
          "
        >
          {icon}
        </div>

        <h3
          className="
          text-sm
          font-semibold
          text-white
          "
        >
          {title}
        </h3>
      </div>

      <p className="break-words text-sm leading-6 text-gray-300 group-hover:text-white transition-colors duration-300">
        {value || "Not available"}
      </p>

      {/* Decorative Bottom Line */}
      <div className="mt-3 h-0.5 w-0 bg-gradient-to-r from-[#d4af37] to-[#b88f1d] transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
}
