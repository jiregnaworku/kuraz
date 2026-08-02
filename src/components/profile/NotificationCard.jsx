import {
  FaShoppingBag,
  FaCreditCard,
  FaBullhorn,
  FaInfoCircle,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function NotificationCard({ notification }) {
  const { t } = useLanguage();

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

  const getTypeTranslation = (type) => {
    const typeMap = {
      order: t("notification.typeOrder") || "Order",
      payment: t("notification.typePayment") || "Payment",
      promotion: t("notification.typePromotion") || "Promotion",
      message: t("notification.typeMessage") || "Message",
      system: t("notification.typeSystem") || "System",
    };
    return typeMap[type] || type;
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

        <div className="mt-2 flex items-center gap-3">
          <span className="text-[10px] font-medium text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full">
            {getTypeTranslation(notification.type)}
          </span>
        </div>

        <p
          className="
          mt-2
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
