import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  getNotifications,
  markAllAsRead,
  deleteNotification,
} from "../../api/notificationApi";
import { useLanguage } from "../../context/LanguageContext";

export default function AdminNotifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch Notifications
  // ===============================

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(t("admin.failedToLoad") || "Failed to load notifications");
      // Fallback to demo data if API fails
      setNotifications([
        {
          _id: "1",
          title: t("admin.notificationNewOrder") || "New Order Received",
          message:
            t("admin.notificationOrderPlaced") ||
            "Order #KURAZ-20260731-1234 has been placed",
          type: "order",
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
        },
        {
          _id: "2",
          title: t("admin.notificationOrderDelivered") || "Order Delivered",
          message:
            t("admin.notificationDeliveredSuccess") ||
            "Order #KURAZ-20260730-5678 has been delivered successfully",
          type: "order",
          isRead: true,
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        },
        {
          _id: "3",
          title: t("admin.notificationNewUser") || "New User Registered",
          message:
            t("admin.notificationUserCreated") ||
            "John Doe has created an account",
          type: "system",
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  // ===============================
  // Mark All as Read
  // ===============================

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success(
        t("admin.markAllReadSuccess") || "All notifications marked as read",
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error(t("admin.failedToMarkRead") || "Failed to mark all as read");
    }
  };

  // ===============================
  // Delete Notification
  // ===============================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        t("admin.deleteNotificationConfirm") ||
          "Are you sure you want to delete this notification?",
      )
    ) {
      return;
    }

    try {
      await deleteNotification(id);
      toast.success(t("admin.notificationDeleted") || "Notification deleted");
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(t("admin.failedToDelete") || "Failed to delete notification");
    }
  };

  // ===============================
  // Get Notification Icon
  // ===============================

  const getNotificationIcon = (type) => {
    const icons = {
      order: <FaShoppingBag className="text-[#d4af37]" />,
      payment: <FaCheckCircle className="text-green-500" />,
      shipping: <FaTruck className="text-blue-500" />,
      delivered: <FaCheck className="text-green-500" />,
      cancelled: <FaTimesCircle className="text-red-500" />,
      user: <FaUserPlus className="text-purple-500" />,
      system: <FaInfoCircle className="text-gray-500" />,
    };
    return icons[type] || icons.system;
  };

  // ===============================
  // Get Notification Color
  // ===============================

  const getNotificationColor = (type) => {
    const colors = {
      order: "bg-[#d4af37]/10 border-[#d4af37]/20",
      payment: "bg-green-50 border-green-200",
      shipping: "bg-blue-50 border-blue-200",
      delivered: "bg-green-50 border-green-200",
      cancelled: "bg-red-50 border-red-200",
      user: "bg-purple-50 border-purple-200",
      system: "bg-gray-50 border-gray-200",
    };
    return colors[type] || colors.system;
  };

  // ===============================
  // Format Time
  // ===============================

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("admin.justNow") || "Just now";
    if (minutes < 60) {
      return (
        t("admin.minutesAgo", { count: minutes }) ||
        `${minutes} minute${minutes > 1 ? "s" : ""} ago`
      );
    }
    if (hours < 24) {
      return (
        t("admin.hoursAgo", { count: hours }) ||
        `${hours} hour${hours > 1 ? "s" : ""} ago`
      );
    }
    if (days < 7) {
      return (
        t("admin.daysAgo", { count: days }) ||
        `${days} day${days > 1 ? "s" : ""} ago`
      );
    }
    return new Date(date).toLocaleDateString();
  };

  // ===============================
  // Count Unread
  // ===============================

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6f8] to-[#e8e9ec] px-4 pt-28 pb-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#24312c]">
              {t("admin.notifications")}
            </h1>
            <p className="mt-1 text-gray-500">{t("admin.notificationsDesc")}</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
                {unreadCount} {t("admin.unread")}
              </span>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-2.5 font-medium text-white transition hover:bg-[#b88f1d] hover:shadow-lg"
              >
                <FaCheck />
                {t("admin.markAllRead")}
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-3xl bg-white p-16 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <FaBell className="text-4xl text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-[#24312c]">
                {t("admin.noNotifications")}
              </h3>
              <p className="mt-2 text-gray-500">{t("admin.allCaughtUp")}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`group rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${getNotificationColor(
                  notification.type,
                )} ${!notification.isRead ? "border-l-4 border-l-[#d4af37]" : "opacity-80"}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-white p-2 shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#24312c]">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="flex-shrink-0">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#d4af37]"></span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              {t("admin.showing", { count: notifications.length })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
