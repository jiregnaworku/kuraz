import {
  FaShoppingBag,
  FaCreditCard,
  FaBullhorn,
  FaInfoCircle,
} from "react-icons/fa";

export default function NotificationCard({ notification }) {
  const getIcon = () => {
    switch (notification.type) {
      case "order":
        return <FaShoppingBag />;

      case "payment":
        return <FaCreditCard />;

      case "promotion":
        return <FaBullhorn />;

      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div
      className={`
      flex
      gap-4
      rounded-2xl
      border
      p-5
      transition

      ${
        notification.isRead
          ? "bg-white border-gray-200"
          : "bg-[#fff8e6] border-[#d4af37]"
      }

      hover:shadow-md
      `}
    >
      {/* Icon */}

      <div
        className="
        flex
        h-12
        w-12
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#24312c]
        text-[#d4af37]
        text-xl
        "
      >
        {getIcon()}
      </div>

      {/* Content */}

      <div className="flex-1">
        <div
          className="
          flex
          items-center
          justify-between
          gap-3
          "
        >
          <h3
            className="
            font-bold
            text-[#24312c]
            "
          >
            {notification.title}
          </h3>

          {!notification.isRead && (
            <span
              className="
              h-3
              w-3
              rounded-full
              bg-[#d4af37]
              "
            />
          )}
        </div>

        <p
          className="
          mt-2
          text-sm
          text-gray-600
          "
        >
          {notification.message}
        </p>

        <p
          className="
          mt-3
          text-xs
          text-gray-400
          "
        >
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
