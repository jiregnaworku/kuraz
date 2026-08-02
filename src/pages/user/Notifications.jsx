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

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [markingAll, setMarkingAll] = useState(false);

  // ===============================
  // Load Notifications
  // ===============================

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Notification loading error:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, [loadNotifications]);

  // ===============================
  // Mark as Read
  // ===============================

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      toast.success("Notification marked as read");
      loadNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  // ===============================
  // Mark All as Read - Fixed Version
  // ===============================

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    if (unreadNotifications.length === 0) {
      toast.success("All notifications are already read");
      return;
    }

    setMarkingAll(true);

    try {
      // Try the bulk endpoint first (now using /read-all)
      await markAllAsRead();
      toast.success("All notifications marked as read");
      loadNotifications();
    } catch (error) {
      console.error("Bulk mark all failed, trying individual:", error);

      // Fallback: Mark each unread notification individually
      try {
        const promises = unreadNotifications.map((n) =>
          markNotificationRead(n._id),
        );
        await Promise.all(promises);
        toast.success("All notifications marked as read");
        loadNotifications();
      } catch (fallbackError) {
        console.error("Individual mark all failed:", fallbackError);
        toast.error("Failed to mark all as read. Please try again.");
      }
    } finally {
      setMarkingAll(false);
    }
  };

  // ===============================
  // Delete Notification
  // ===============================

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
      loadNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  // ===============================
  // Get Notification Icon
  // ===============================

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

  // ===============================
  // Get Notification Color
  // ===============================

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

  // ===============================
  // Filter Notifications
  // ===============================

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
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#d4af37]/10 p-2">
                <FaBell className="text-2xl text-[#d4af37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#24312c]">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500">
                  Stay updated with your orders and account activities
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
                {unreadCount} unread
              </span>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll || unreadCount === 0}
                className={`flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition ${
                  markingAll || unreadCount === 0
                    ? "cursor-not-allowed opacity-50 text-gray-400"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {markingAll ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent"></div>
                    Marking...
                  </>
                ) : (
                  <>
                    <FaCheckDouble />
                    Mark all read
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex gap-2">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === tab
                  ? "bg-[#d4af37] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`group relative rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${getNotificationColor(
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
                          <FaCircle className="text-[10px] text-[#d4af37]" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        •
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="flex items-center gap-1 rounded-lg bg-[#d4af37]/10 px-3 py-1.5 text-xs font-medium text-[#d4af37] transition hover:bg-[#d4af37]/20"
                      >
                        <FaCheck className="text-xs" />
                        Mark as read
                      </button>
                    )}

                    {notification.type === "order" && (
                      <Link
                        to="/profile/orders"
                        className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                      >
                        <FaShoppingBag className="text-xs" />
                        View Order
                      </Link>
                    )}

                    {notification.type === "promotion" && (
                      <Link
                        to="/collection"
                        className="flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 transition hover:bg-purple-100"
                      >
                        <FaTag className="text-xs" />
                        View Collection
                      </Link>
                    )}

                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FaBell className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-[#24312c]">
              No notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "You don't have any notifications yet"
                : filter === "unread"
                  ? "You don't have any unread notifications"
                  : "You don't have any read notifications"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-xs text-gray-400">
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            notifications
          </p>
        </div>
      )}
    </div>
  );
}
