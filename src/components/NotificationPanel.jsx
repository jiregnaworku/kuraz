// components/NotificationPanel.jsx
import { useState, useEffect } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../api/notificationApi";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      const notificationsList = data?.notifications || data?.data || [];
      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      // Mark as read
      await markNotificationAsRead(notificationId);

      // Update local state to mark it as read
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );

      // Navigate or handle click action based on notification type
      // For example: navigate to the notification's link
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Import from your API
      // await markAllNotificationsAsRead();

      // Update all notifications to read
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="notification-panel">
      <div className="header">
        <h2>Notifications</h2>
        <button onClick={handleMarkAllAsRead}>Mark all as read</button>
      </div>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => handleNotificationClick(notification._id)}
            className={`notification-item ${!notification.isRead ? "unread" : ""}`}
          >
            {!notification.isRead && <span className="unread-dot">•</span>}
            <div className="content">
              <p>{notification.message}</p>
              <small>
                {new Date(notification.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
