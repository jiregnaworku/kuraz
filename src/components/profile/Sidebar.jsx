import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaShoppingBag,
  FaComments,
  FaBell,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { getNotifications } from "../../api/notificationApi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
      end: true,
    },
    {
      name: "My Orders",
      path: "/profile/orders",
      icon: <FaShoppingBag />,
    },
    {
      name: "Messages",
      path: "/profile/messages",
      icon: <FaComments />,
    },
    {
      name: "Notifications",
      path: "/profile/notifications",
      icon: <FaBell />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: "Settings",
      path: "/profile/settings",
      icon: <FaCog />,
    },
  ];

  // ==========================
  // Fetch Unread Notification Count
  // ==========================

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await getNotifications();
      const unread = data.notifications?.filter((n) => !n.isRead).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUnreadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // ==========================
  // LOGOUT
  // ==========================

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/signin");
  };

  return (
    <>
      {/* MOBILE BUTTON - Now on Right Side */}
      <button
        onClick={() => setOpen(!open)}
        className="
        fixed
        right-5
        top-5
        z-[1000]

        flex
        h-11
        w-11
        items-center
        justify-center

        rounded-full

        bg-[#24312c]/95

        text-lg
        text-[#d4af37]

        shadow-[0_12px_30px_rgba(36,49,44,0.25)]

        lg:hidden
        "
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* OVERLAY MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          z-[998]
          bg-black/40
          backdrop-blur-sm
          lg:hidden
          "
        />
      )}

      {/* SIDEBAR - Slides from Right */}
      <aside
        className={`
        fixed
        right-0
        top-0
        z-[999]

        h-screen
        w-80

        bg-[linear-gradient(180deg,_#24312c_0%,_#1b2521_100%)]

        p-5

        shadow-2xl

        transition-transform
        duration-300
        ease-in-out

        lg:static
        lg:h-fit
        lg:rounded-[1.75rem]
        lg:translate-x-0
        lg:shadow-[0_18px_50px_rgba(36,49,44,0.16)]

        ${open ? "translate-x-0" : "translate-x-full"}

        `}
      >
        {/* HEADER */}
        <div
          className="
          mb-8
          text-center
          "
        >
          {/* Close button inside sidebar for mobile */}
          <button
            onClick={() => setOpen(false)}
            className="
            absolute
            left-4
            top-4
            text-white/60
            hover:text-white
            transition-colors
            lg:hidden
            "
          >
            <FaTimes className="text-2xl" />
          </button>

          <div
            className="
            mx-auto
            flex
            h-18
            w-18

            items-center
            justify-center

            rounded-full

            bg-white/95

            text-2xl
            text-[#d4af37]

            shadow-lg

            "
          >
            <FaUser />
          </div>

          <h2
            className="
            mt-4
            text-lg
            font-bold
            text-white
            "
          >
            My Account
          </h2>

          <p
            className="
            mt-1
            text-xs
            text-gray-300/90
            "
          >
            Manage your account
          </p>
        </div>

        {/* MENU */}
        <nav
          className="
          space-y-2.5
          "
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3

                rounded-2xl

                px-4
                py-3.5

                font-medium

                transition

                ${
                  isActive
                    ? "bg-[#d4af37] text-white shadow-[0_10px_25px_rgba(212,175,55,0.28)]"
                    : "text-gray-200 hover:bg-white/10 hover:text-white"
                }

                `
              }
            >
              <span className="text-lg">{item.icon}</span>

              <span className="flex-1">{item.name}</span>

              {item.badge && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="
            flex
            w-full
            items-center
            gap-3

            rounded-2xl

            px-4
            py-3.5

            font-medium

            text-red-300

            transition

            hover:bg-red-500/20
            hover:text-red-400
            "
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
