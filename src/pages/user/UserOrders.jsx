import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";

import OrderCard from "../../components/profile/OrderCard";
import { getMyOrders } from "../../api/OrderApi";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();

        setOrders(data.orders || []);
      } catch (error) {
        console.log("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1
          className="
          text-3xl
          font-bold
          text-[#24312c]
          "
        >
          My Orders
        </h1>

        <p className="mt-2 text-gray-500">
          Track your fashion orders and delivery status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          py-16
          text-gray-500
          "
        >
          <FaBoxOpen
            className="
            mb-4
            text-5xl
            text-[#d4af37]
            "
          />

          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
