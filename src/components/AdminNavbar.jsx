// src/components/AdminNavbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaShoppingBag,
  FaBoxOpen,
  FaUsers,
  FaComments,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaGlobe,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import ConfirmModal from "./profile/ConfirmModal";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const admin = JSON.parse(localStorage.getItem("user") || "null");

  // Toggle language function
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  const menu = [
    {
      name: t("admin.dashboard") || "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      name: t("admin.ordersManagement") || "Orders",
      path: "/admin/orders",
      icon: <FaShoppingBag />,
    },
    {
      name: t("admin.productManagement") || "Products",
      path: "/admin/products",
      icon: <FaBoxOpen />,
    },
    {
      name: t("admin.userManagement") || "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: t("admin.messages") || "Messages",
      path: "/admin/messages",
      icon: <FaComments />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <>
      <header
        className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-white/10
        bg-[#1b2b26]/95
        backdrop-blur-xl
        shadow-lg
        "
      >
        <div
          className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-3
          sm:px-4
          md:h-20
          lg:px-6
          "
        >
          {/* Logo and Home Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/admin"
              className="
              text-base
              font-bold
              tracking-wide
              text-[#d4af37]
              sm:text-lg
              md:text-2xl
              "
            >
              Kuraz Admin
            </Link>

            {/* Back to Home - Mobile */}
            <Link
              to="/#home"
              className="
              rounded-full
              bg-white/10
              p-2
              text-gray-200
              transition
              hover:bg-white/20
              hover:text-[#d4af37]
              sm:p-2.5
              md:hidden
              "
              title={t("admin.backToHome")}
            >
              <FaHome className="text-xs sm:text-sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="
            hidden
            items-center
            gap-1
            lg:flex
            xl:gap-2
            "
          >
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  xl:px-4
                  xl:py-2.5

                  ${
                    isActive
                      ? "bg-[#d4af37] text-[#1b2b26] shadow-md"
                      : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                  }
                  `
                }
              >
                <span className="text-xs xl:text-sm">{item.icon}</span>
                <span className="hidden xl:inline">{item.name}</span>
                <span className="xl:hidden">{item.name.charAt(0)}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div
            className="
            hidden
            items-center
            gap-1
            sm:gap-2
            md:gap-3
            lg:flex
            "
          >
            {/* Language Toggle - Syncs with Home page */}
            <button
              onClick={toggleLanguage}
              className="
              flex
              items-center
              gap-1.5
              rounded-xl
              bg-white/10
              px-3
              py-2
              text-sm
              text-gray-200
              transition
              hover:bg-white/20
              hover:text-[#d4af37]
              "
            >
              <FaGlobe className="text-xs xl:text-sm" />
              <span className="hidden xl:inline">
                {language === "en" ? "አማ" : "EN"}
              </span>
            </button>

            {/* Back to Home - Desktop */}
            <Link
              to="/#home"
              className="
              hidden
              items-center
              gap-2
              rounded-full
              bg-white/10
              px-3
              py-2
              text-sm
              text-gray-200
              transition
              hover:bg-white/20
              hover:text-[#d4af37]
              lg:flex
              xl:px-4
              "
            >
              <FaHome className="text-xs xl:text-sm" />
              <span className="hidden xl:inline">{t("admin.backToHome")}</span>
            </Link>

            {/* Notifications */}
            <Link
              to="/admin/notifications"
              className="
              relative
              rounded-xl
              p-2.5
              text-gray-200
              transition
              hover:bg-white/10
              hover:text-[#d4af37]
              sm:p-3
              "
            >
              <FaBell className="text-sm sm:text-base" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Link>

            {/* Profile Link - Desktop */}
            <Link
              to="/admin/profile"
              className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-white/5
              px-2
              py-1.5
              transition
              hover:bg-white/10
              hover:shadow-lg
              sm:px-3
              sm:py-2
              "
            >
              <FaUserCircle className="text-[#d4af37]" size={24} />

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white sm:text-sm">
                  {admin?.fullName?.split(" ")[0] || t("admin.administrator")}
                </p>

                <p className="text-[10px] text-gray-400 sm:text-xs">
                  {t("admin.administrator")}
                </p>
              </div>
            </Link>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="
              rounded-xl
              bg-red-500/10
              p-2.5
              text-red-400
              transition
              hover:bg-red-500
              hover:text-white
              sm:p-3
              "
            >
              <FaSignOutAlt className="text-sm sm:text-base" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="
            rounded-xl
            p-2
            text-white
            hover:bg-white/10
            sm:p-3
            lg:hidden
            "
          >
            {open ? (
              <FaTimes className="text-lg sm:text-xl" />
            ) : (
              <FaBars className="text-lg sm:text-xl" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`
        fixed
        top-0
        right-0
        z-50
        h-screen
        w-[280px]
        bg-[#1b2b26]
        shadow-2xl
        transition-transform
        duration-300
        ease-in-out
        lg:hidden

        ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
          <h2 className="text-lg font-bold text-[#d4af37] sm:text-xl">
            {t("admin.adminMenu")}
          </h2>

          <button onClick={() => setOpen(false)} className="text-white p-1">
            <FaTimes className="text-xl sm:text-2xl" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {/* User Info */}
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <FaUserCircle size={40} className="text-[#d4af37] sm:text-5xl" />

            <div>
              <h3 className="text-sm font-semibold text-white sm:text-base">
                {admin?.fullName || t("admin.administrator")}
              </h3>

              <p className="text-xs text-gray-400 sm:text-sm">
                {t("admin.administrator")}
              </p>
            </div>
          </div>

          {/* Language Toggle - Mobile */}
          <button
            onClick={() => {
              toggleLanguage();
              setOpen(false);
            }}
            className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-sm
            text-gray-200
            transition
            hover:bg-white/10
            sm:px-4
            sm:py-3
            mb-2
            "
          >
            <FaGlobe className="text-base sm:text-lg" />
            <span className="text-sm sm:text-base">
              {language === "en" ? "አማርኛ" : "English"}
            </span>
            <span className="ml-auto text-xs text-gray-400">
              {language === "en" ? "ለውጥ" : "Switch"}
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 sm:space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                end={item.end}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  transition
                  sm:px-4
                  sm:py-3

                  ${
                    isActive
                      ? "bg-[#d4af37] text-[#1b2b26]"
                      : "text-gray-200 hover:bg-white/10"
                  }
                  `
                }
              >
                <span className="text-base sm:text-lg">{item.icon}</span>
                <span className="text-sm sm:text-base">{item.name}</span>
              </NavLink>
            ))}

            {/* Notifications - Mobile */}
            <NavLink
              to="/admin/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/10 sm:px-4 sm:py-3"
            >
              <FaBell className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base">
                {t("admin.notifications")}
              </span>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                0
              </span>
            </NavLink>

            {/* Profile - Mobile */}
            <NavLink
              to="/admin/profile"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                transition
                sm:px-4
                sm:py-3

                ${
                  isActive
                    ? "bg-[#d4af37] text-[#1b2b26]"
                    : "text-gray-200 hover:bg-white/10"
                }
                `
              }
            >
              <FaUserCircle className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base">
                {t("admin.adminProfile")}
              </span>
            </NavLink>

            {/* Back to Home - Mobile */}
            <Link
              to="/#home"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/10 sm:px-4 sm:py-3"
            >
              <FaHome className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base">
                {t("admin.backToHome")}
              </span>
            </Link>

            {/* Divider */}
            <div className="my-3 border-t border-white/10 sm:my-4"></div>

            {/* Logout - Mobile */}
            <button
              onClick={() => {
                setOpen(false);
                setShowLogoutModal(true);
              }}
              className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              bg-red-500/10
              px-3
              py-2.5
              text-sm
              text-red-400
              transition
              hover:bg-red-500
              hover:text-white
              sm:px-4
              sm:py-3
              "
            >
              <FaSignOutAlt className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base">{t("admin.logout")}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          z-40
          bg-black/40
          backdrop-blur-sm
          lg:hidden
          "
        />
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        title={t("admin.logoutConfirmTitle")}
        message={t("admin.logoutConfirmMessage")}
        confirmText={t("admin.logout")}
        cancelText={t("common.cancel")}
        type="danger"
        icon={<FaSignOutAlt className="text-3xl text-red-600" />}
      />
    </>
  );
}
