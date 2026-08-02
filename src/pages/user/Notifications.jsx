import { useEffect, useState, useCallback } from "react";
import {
  FaBell,
  FaCheck,
  FaShoppingBag,
  FaCreditCard,
  FaTag,
  FaInfoCircle,
  FaTrash,
  FaCheckDouble,
  FaCircle,
} from "react-icons/fa";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
  markAllAsRead,
} from "../../api/notificationApi";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function Notifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Notification loading error:", error);
      toast.error(
        t("notifications.failedToLoad") || "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      toast.success(
        t("notifications.markedAsRead") || "Notification marked as read",
      );
      loadNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error(
        t("notifications.failedToMarkRead") || "Failed to mark as read",
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    if (unreadNotifications.length === 0) {
      toast.success(
        t("notifications.alreadyRead") || "All notifications are already read",
      );
      return;
    }
    setMarkingAll(true);
    try {
      await markAllAsRead();
      toast.success(
        t("notifications.markedAllRead") || "All notifications marked as read",
      );
      loadNotifications();
    } catch (error) {
      console.error("Bulk mark all failed, trying individual:", error);
      try {
        await Promise.all(
          unreadNotifications.map((n) => markNotificationRead(n._id)),
        );
        toast.success(
          t("notifications.markedAllRead") ||
            "All notifications marked as read",
        );
        loadNotifications();
      } catch (fallbackError) {
        console.error("Individual mark all failed:", fallbackError);
        toast.error(
          t("notifications.failedToMarkAll") ||
            "Failed to mark all as read. Please try again.",
        );
      }
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        t("notifications.deleteConfirm") ||
          "Are you sure you want to delete this notification?",
      )
    )
      return;
    try {
      await deleteNotification(id);
      toast.success(t("notifications.deleted") || "Notification deleted");
      loadNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(
        t("notifications.failedToDelete") || "Failed to delete notification",
      );
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: <FaShoppingBag className="text-[#d4af37]" />,
      payment: <FaCreditCard className="text-green-500" />,
      promotion: <FaTag className="text-purple-500" />,
      message: <FaInfoCircle className="text-blue-500" />,
      system: <FaInfoCircle className="text-gray-500" />,
    };
    return icons[type] || icons.system;
  };

  const getNotificationColor = (type) => {
    const colors = {
      order: "bg-[#d4af37]/10 border-[#d4af37]/20",
      payment: "bg-green-50 border-green-200",
      promotion: "bg-purple-50 border-purple-200",
      message: "bg-blue-50 border-blue-200",
      system: "bg-gray-50 border-gray-200",
    };
    return colors[type] || colors.system;
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-5 lg:p-6 shadow-xl w-full overflow-hidden">
      {/* Header */}
      <div className="mb-4 lg:mb-6 border-b pb-3 lg:pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="rounded-full bg-[#d4af37]/10 p-1.5 lg:p-2">
              <FaBell className="text-lg lg:text-2xl text-[#d4af37]" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-[#24312c]">
                {t("notifications.title")}
              </h1>
              <p className="text-xs lg:text-sm text-gray-500">
                {t("notifications.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 lg:px-3 lg:py-1 text-xs font-medium text-white">
                {unreadCount} {t("notifications.unread")}
              </span>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll || unreadCount === 0}
                className={`flex items-center gap-1.5 rounded-lg lg:rounded-xl border border-gray-200 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium transition ${
                  markingAll || unreadCount === 0
                    ? "cursor-not-allowed opacity-50 text-gray-400"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {markingAll ? (
                  <>
                    <div className="h-3 w-3 lg:h-4 lg:w-4 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent"></div>
                    {t("notifications.marking")}
                  </>
                ) : (
                  <>
                    <FaCheckDouble />
                    {t("notifications.markAllRead")}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 lg:mt-4 flex gap-1.5 lg:gap-2">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full px-3 py-1 lg:px-4 lg:py-1.5 text-xs lg:text-sm font-medium transition ${
                filter === tab
                  ? "bg-[#d4af37] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t(`notifications.tab_${tab}`) ||
                tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] lg:text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2 lg:space-y-3 max-h-[60vh] lg:max-h-none overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`group relative rounded-xl lg:rounded-2xl border p-3 lg:p-4 transition-all duration-200 hover:shadow-md ${getNotificationColor(notification.type)} ${
                !notification.isRead
                  ? "border-l-4 border-l-[#d4af37]"
                  : "opacity-80"
              }`}
            >
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="flex-shrink-0">
                  <div className="rounded-full bg-white p-1.5 lg:p-2 shadow-sm">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm lg:text-base font-semibold text-[#24312c] truncate">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="flex-shrink-0">
                          <FaCircle className="text-[8px] lg:text-[10px] text-[#d4af37]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] lg:text-xs text-gray-400 whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString()} •{" "}
                      {new Date(notification.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs lg:text-sm text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="mt-2 lg:mt-3 flex flex-wrap gap-1.5 lg:gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="flex items-center gap-1 rounded-lg bg-[#d4af37]/10 px-2 py-1 lg:px-3 lg:py-1.5 text-[11px] lg:text-xs font-medium text-[#d4af37] transition hover:bg-[#d4af37]/20"
                      >
                        <FaCheck className="text-[10px] lg:text-xs" />
                        {t("notifications.markAsRead")}
                      </button>
                    )}
                    {notification.type === "order" && (
                      <Link
                        to="/profile/orders"
                        className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 lg:px-3 lg:py-1.5 text-[11px] lg:text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                      >
                        <FaShoppingBag className="text-[10px] lg:text-xs" />
                        {t("notifications.viewOrder")}
                      </Link>
                    )}
                    {notification.type === "promotion" && (
                      <Link
                        to="/collection"
                        className="flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 lg:px-3 lg:py-1.5 text-[11px] lg:text-xs font-medium text-purple-600 transition hover:bg-purple-100"
                      >
                        <FaTag className="text-[10px] lg:text-xs" />
                        {t("notifications.viewCollection")}
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 lg:px-3 lg:py-1.5 text-[11px] lg:text-xs font-medium text-red-500 transition hover:bg-red-100"
                    >
                      <FaTrash className="text-[10px] lg:text-xs" />
                      {t("notifications.delete")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 lg:py-16 text-center">
            <div className="mx-auto mb-3 lg:mb-4 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-gray-100">
              <FaBell className="text-2xl lg:text-3xl text-gray-300" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-[#24312c]">
              {t("notifications.noNotifications")}
            </h3>
            <p className="mt-1 text-xs lg:text-sm text-gray-500">
              {filter === "all"
                ? t("notifications.noNotificationsAll")
                : filter === "unread"
                  ? t("notifications.noNotificationsUnread")
                  : t("notifications.noNotificationsRead")}
            </p>
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="mt-4 lg:mt-6 border-t pt-3 lg:pt-4 text-center">
          <p className="text-[11px] lg:text-xs text-gray-400">
            {t("notifications.showing", {
              shown: filteredNotifications.length,
              total: notifications.length,
            })}
          </p>
        </div>
      )}
    </div>
  );
}
