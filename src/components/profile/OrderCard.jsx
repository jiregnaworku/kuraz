import {
  FaBox,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPalette,
  FaRuler,
} from "react-icons/fa";

export default function OrderCard({ order }) {
  return (
    <div
      className="
      rounded-2xl
      border
      bg-white
      p-5
      shadow-md
      transition
      hover:shadow-xl
      "
    >
      {/* Header */}

      <div
        className="
        mb-5
        flex
        items-center
        justify-between
        border-b
        pb-4
        "
      >
        <div>
          <h2
            className="
            font-bold
            text-[#24312c]
            "
          >
            {order.productName}
          </h2>

          <p
            className="
            mt-1
            text-sm
            text-gray-500
            "
          >
            Order #{order.orderNumber}
          </p>
        </div>

        <span
          className={`
          rounded-full
          px-4
          py-2
          text-sm
          font-semibold

          ${
            order.orderStatus === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.orderStatus === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }
          `}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Content */}

      <div
        className="
        flex
        gap-5
        max-sm:flex-col
        "
      >
        {/* Product Image */}

        <img
          src={order.productImage || "/assets/images/no-image.png"}
          alt={order.productName}
          className="
          h-32
          w-32
          rounded-xl
          object-cover
          "
        />

        {/* Details */}

        <div
          className="
          space-y-3
          text-sm
          text-gray-600
          "
        >
          <p
            className="
            flex
            items-center
            gap-2
            "
          >
            <FaBox className="text-[#d4af37]" />
            Quantity:
            <span className="font-semibold">{order.quantity}</span>
          </p>

          <p
            className="
            flex
            items-center
            gap-2
            "
          >
            <FaRuler className="text-[#d4af37]" />
            Size:
            <span className="font-semibold">{order.size || "N/A"}</span>
          </p>

          <p
            className="
            flex
            items-center
            gap-2
            "
          >
            <FaPalette className="text-[#d4af37]" />
            Color:
            <span className="font-semibold">{order.color || "N/A"}</span>
          </p>

          <p
            className="
            flex
            items-center
            gap-2
            "
          >
            <FaMoneyBillWave className="text-[#d4af37]" />
            Total:
            <span className="font-semibold">{order.totalPrice} ETB</span>
          </p>

          <p
            className="
            flex
            items-center
            gap-2
            "
          >
            <FaCalendarAlt className="text-[#d4af37]" />

            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Payment */}

      <div
        className="
        mt-5
        rounded-xl
        bg-gray-50
        p-3
        text-sm
        "
      >
        <p>
          Payment Method:
          <span className="ml-2 font-semibold">{order.paymentMethod}</span>
        </p>

        {order.note && (
          <p className="mt-2">
            Note:
            <span className="ml-2">{order.note}</span>
          </p>
        )}
      </div>
    </div>
  );
}
