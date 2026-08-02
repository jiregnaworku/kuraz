import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPalette,
  FaRuler,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function OrderCard({ order }) {
  const { t } = useLanguage();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusTranslation = (status) => {
    const statusMap = {
      Pending: t("order.statusPending") || "Pending",
      Accepted: t("order.statusAccepted") || "Accepted",
      Preparing: t("order.statusPreparing") || "Preparing",
      Shipping: t("order.statusShipping") || "Shipping",
      Delivered: t("order.statusDelivered") || "Delivered",
      Cancelled: t("order.statusCancelled") || "Cancelled",
    };
    return statusMap[status] || status;
  };

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-gray-100
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        hover:border-[#d4af37]/20
        max-w-sm
        mx-auto
      "
    >
      {/* Decorative Gradient Bar */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#b88f1d] to-[#d4af37] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#24312c] group-hover:text-[#d4af37] transition-colors duration-300">
            {order.productName}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">#{order.orderNumber}</p>
        </div>

        <div
          className={`
            ml-2
            flex
            items-center
            gap-1.5
            rounded-full
            border
            px-2.5
            py-1
            text-xs
            font-medium
            whitespace-nowrap
            ${getStatusColor(order.orderStatus)}
          `}
        >
          {getStatusIcon(order.orderStatus)}
          <span>{getStatusTranslation(order.orderStatus)}</span>
        </div>
      </div>

      {/* Content - Compact Layout */}
      <div className="flex gap-3">
        {/* Product Image - Smaller */}
        <div className="relative flex-shrink-0">
          <img
            src={order.productImage || "/assets/images/no-image.png"}
            alt={order.productName}
            className="
              h-20
              w-20
              rounded-lg
              object-cover
              border
              border-gray-100
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
          {/* Quantity Badge */}
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-bold text-white shadow-sm">
            {order.quantity}
          </div>
        </div>

        {/* Details - Compact */}
        <div className="flex-1 space-y-1.5 text-xs">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            <div className="flex items-center gap-1.5 text-gray-500">
              <FaRuler className="text-[10px] text-[#d4af37]" />
              <span>{order.size || t("order.notSpecified") || "N/A"}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500">
              <FaPalette className="text-[10px] text-[#d4af37]" />
              <span>{order.color || t("order.notSpecified") || "N/A"}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500 col-span-2">
              <FaMoneyBillWave className="text-[10px] text-[#d4af37]" />
              <span className="font-semibold text-[#24312c]">
                {order.totalPrice} ETB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <FaCalendarAlt className="text-[10px] text-[#d4af37]" />
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Payment & Note - Compact */}
      <div className="mt-3 rounded-lg bg-gray-50/80 p-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">{t("order.paymentMethod")}:</span>
          <span className="font-medium text-[#24312c]">
            {order.paymentMethod}
          </span>
        </div>
        {order.note && (
          <div className="mt-1 flex items-start gap-1.5 border-t border-gray-100 pt-1.5">
            <span className="text-gray-500">{t("order.note")}:</span>
            <span className="text-gray-600 line-clamp-1">{order.note}</span>
          </div>
        )}
      </div>

      {/* Action Button - Optional */}
      <div className="mt-3 flex justify-end">
        <button
          className="
            text-xs
            font-medium
            text-[#d4af37]
            transition-all
            duration-300
            hover:text-[#b88f1d]
            hover:scale-105
          "
        >
          {t("order.viewDetails")} →
        </button>
      </div>
    </div>
  );
}
