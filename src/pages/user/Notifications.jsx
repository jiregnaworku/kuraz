import { useEffect, useState } from "react";
import NotificationCard from "../../components/profile/NotificationCard";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      /*
        Later replace this with:

        const data = await getNotifications();
        setNotifications(data);

        from notificationApi.js
      */

      // Temporary test data

      setNotifications([
        {
          _id: 1,
          title: "Order Confirmed",
          message:
            "Your order KURAZ-20260729-1234 has been received successfully.",
          type: "order",
          isRead: false,
          createdAt: new Date(),
        },

        {
          _id: 2,
          title: "Payment Received",
          message: "Your payment has been verified by Kuraz Design.",
          type: "payment",
          isRead: true,
          createdAt: new Date(),
        },

        {
          _id: 3,
          title: "New Collection",
          message: "New Ethiopian cultural dresses are available now.",
          type: "promotion",
          isRead: false,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.log("Notification loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div
        className="
        flex
        min-h-[400px]
        items-center
        justify-center
        text-gray-500
        "
      >
        Loading notifications...
      </div>
    );
  }

  return (
    <div
      className="
      rounded-3xl
      bg-white
      p-6
      shadow-xl
      "
    >
      <div
        className="
        mb-6
        border-b
        pb-4
        "
      >
        <h1
          className="
          text-2xl
          font-bold
          text-[#24312c]
          "
        >
          Notifications
        </h1>

        <p
          className="
          mt-1
          text-sm
          text-gray-500
          "
        >
          Stay updated with your orders and account activities.
        </p>
      </div>

      <div
        className="
        space-y-4
        "
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))
        ) : (
          <div
            className="
            py-10
            text-center
            text-gray-400
            "
          >
            No notifications available
          </div>
        )}
      </div>
    </div>
  );
}
