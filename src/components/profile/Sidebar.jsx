import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { getNotifications, markAllAsRead } from "../../api/notificationApi";
import { useLanguage } from "../../context/LanguageContext";

export default function Sidebar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const intervalRef = useRef(null);

  const token = localStorage.getItem("token");

  const menuItems = useMemo(
    () => [
      {
        name: t("profile.profile"),
        path: "/profile",
        icon: <FaUser />,
        end: true,
      },
      {
        name: t("profile.myOrders"),
        path: "/profile/orders",
        icon: <FaShoppingBag />,
      },
      {
        name: t("profile.messages"),
        path: "/profile/messages",
        icon: <FaComments />,
        badge: unreadMessages > 0 ? unreadMessages : null,
      },
      {
        name: t("profile.notifications"),
        path: "/profile/notifications",
        icon: <FaBell />,
        badge: unreadNotifications > 0 ? unreadNotifications : null,
      },
      {
        name: t("profile.settings"),
        path: "/profile/settings",
        icon: <FaCog />,
      },
    ],
    [unreadMessages, unreadNotifications, t],
  );

  // Fetch unread counts
  const fetchUnreadCounts = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!currentToken || !currentUser) {
      if (isMounted.current) {
        setUnreadNotifications(0);
        setUnreadMessages(0);
      }
      return;
    }

    try {
      // Fetch notifications from your backend
      const response = await getNotifications();

      // Handle different response structures
      let notificationsList = [];
      if (response?.notifications) {
        notificationsList = response.notifications;
      } else if (response?.data) {
        notificationsList = response.data;
      } else if (Array.isArray(response)) {
        notificationsList = response;
      } else if (response?.data?.notifications) {
        notificationsList = response.data.notifications;
      }

      // Get current user ID
      const currentUserId = currentUser._id || currentUser.id;

      // Filter notifications for the CURRENT USER only
      const userNotifications = notificationsList.filter((n) => {
        if (!n) return false;

        // Check all possible user ID fields in the notification
        const notificationUserId =
          n.user?._id ||
          n.user?.id ||
          n.userId ||
          n.recipient?._id ||
          n.recipient?.id ||
          n.recipientId ||
          n.user;

        // If no user ID, treat as system notification (show to all users)
        if (!notificationUserId) return true;

        // Compare with current user ID (handle both string and object cases)
        return notificationUserId.toString() === currentUserId.toString();
      });

      // Count unread notifications for THIS user only
      const unreadNotifs = userNotifications.filter(
        (n) => n && !n.isRead,
      ).length;

      if (isMounted.current) {
        setUnreadNotifications(unreadNotifs);
      }

      // If you have a messages API, fetch unread messages count
      // For now, we'll keep it at 0
      if (isMounted.current) {
        setUnreadMessages(0);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
      if (isMounted.current) {
        setUnreadNotifications(0);
        setUnreadMessages(0);
      }
    }
  }, []);

  // Mark ALL notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      // This will call PUT /api/notifications/read-all
      await markAllAsRead();

      // Reset unread count to 0 immediately for better UX
      setUnreadNotifications(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // If the API call fails, try to refetch to get the correct count
      fetchUnreadCounts();
    }
  }, [fetchUnreadCounts]);

  useEffect(() => {
    isMounted.current = true;
    if (token) {
      // Initial fetch
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchUnreadCounts();

      // Set up polling every 30 seconds
      intervalRef.current = setInterval(fetchUnreadCounts, 30000);
    }
    return () => {
      isMounted.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchUnreadCounts, token]);

  const logout = () => {
    if (
      !window.confirm(
        t("profile.logoutConfirm") || "Are you sure you want to logout?",
      )
    )
      return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/signin");
  };

  const closeSidebar = () => setOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-[1001] flex h-10 w-10 items-center justify-center rounded-full bg-[#24312c]/95 text-lg text-[#d4af37] shadow-lg transition-all hover:bg-[#24312c] lg:hidden"
        aria-label={t("profile.toggleMenu") || "Toggle menu"}
      >
        {open ? <FaTimes /> : <FaBars />}
        {(unreadNotifications > 0 || unreadMessages > 0) && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadNotifications + unreadMessages > 9
              ? "9+"
              : unreadNotifications + unreadMessages}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-[1000] h-full w-72 bg-[linear-gradient(180deg,#24312c_0%,#1b2521_100%)] shadow-2xl transition-transform duration-300 ease-in-out xs:w-80 ${
          open ? "translate-x-0" : "translate-x-full"
        } lg:static lg:z-auto lg:h-fit lg:w-full lg:translate-x-0 lg:rounded-[1.75rem] lg:shadow-[0_18px_50px_rgba(36,49,44,0.16)]`}
      >
        <div className="flex h-full flex-col p-4 lg:p-5">
          {/* Header */}
          <div className="mb-5 text-center lg:mb-6">
            <button
              onClick={closeSidebar}
              className="absolute left-3 top-3 rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label={t("profile.closeMenu") || "Close menu"}
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-xl text-[#d4af37] shadow-lg lg:h-16 lg:w-16 lg:text-2xl">
              <FaUser />
            </div>
            <h2 className="mt-3 text-base font-bold text-white lg:text-lg">
              {t("profile.myAccount")}
            </h2>
            <p className="mt-0.5 text-xs text-gray-300/90 lg:text-sm">
              {t("profile.manageAccount")}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 lg:space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => {
                  // When user clicks on Notifications, mark ALL as read
                  if (item.path === "/profile/notifications") {
                    handleMarkAllAsRead();
                  }
                  closeSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 lg:px-4 lg:py-3 ${
                    isActive
                      ? "bg-[#d4af37] text-white shadow-[0_10px_25px_rgba(212,175,55,0.28)]"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-sm lg:text-base">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge !== null &&
                  item.badge !== undefined &&
                  item.badge > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md lg:h-5 lg:w-5 lg:text-[11px]">
                      {item.badge > 99
                        ? "99+"
                        : item.badge > 9
                          ? "9+"
                          : item.badge}
                    </span>
                  )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={logout}
            className="mt-auto flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400 lg:px-4 lg:py-3"
          >
            <FaSignOutAlt className="text-sm lg:text-base" />
            <span>{t("profile.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
