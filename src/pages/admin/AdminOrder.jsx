import { useCallback, useEffect, useState } from "react";
import { FaCheck, FaTruck, FaTimes, FaShoppingBag } from "react-icons/fa";

import { getOrders, updateOrderStatus } from "../../api/OrderApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch Orders
  // ===============================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  // ===============================
  // Update Order Status
  // ===============================

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, {
        status,
      });

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 pt-28 pb-10 sm:px-6 lg:px-10">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#24312c]">
            Orders Management
          </h1>

          <p className="mt-1 text-gray-500">
            Manage customer orders and deliveries.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#24312c] px-6 py-4 text-white shadow">
          <FaShoppingBag className="text-2xl text-[#d4af37]" />

          <div>
            <p className="text-sm text-gray-300">Total Orders</p>

            <h2 className="text-2xl font-bold">{orders.length}</h2>
          </div>
        </div>
      </div>

      {/* Desktop Table */}

      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow md:block">
        <table className="w-full">
          <thead className="bg-[#24312c] text-white">
            <tr>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Payment</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold">
                      {order.customer?.fullName || "Customer"}
                    </p>

                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </td>

                  <td className="px-6 py-4">
                    {order.product?.name || order.productName}
                  </td>

                  <td className="px-6 py-4 font-semibold text-[#24312c]">
                    {order.totalPrice} ETB
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={order.orderStatus} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => changeStatus(order._id, "Accepted")}
                        className="rounded-lg bg-green-100 p-2 text-green-700 transition hover:bg-green-200"
                      >
                        <FaCheck />
                      </button>

                      <button
                        onClick={() => changeStatus(order._id, "Shipping")}
                        className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                      >
                        <FaTruck />
                      </button>

                      <button
                        onClick={() => changeStatus(order._id, "Cancelled")}
                        className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}

      <div className="space-y-5 md:hidden">
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-white p-5 shadow">
              <h3 className="text-lg font-bold text-[#24312c]">
                {order.product?.name || order.productName}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {order.customer?.fullName || "Customer"}
              </p>

              <p className="text-sm text-gray-500">{order.phone}</p>

              <p className="mt-3 text-lg font-bold text-[#d4af37]">
                {order.totalPrice} ETB
              </p>

              <StatusBadge status={order.orderStatus} />

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => changeStatus(order._id, "Accepted")}
                  className="rounded-xl bg-green-100 py-2 font-medium text-green-700"
                >
                  Accept
                </button>

                <button
                  onClick={() => changeStatus(order._id, "Shipping")}
                  className="rounded-xl bg-blue-100 py-2 font-medium text-blue-700"
                >
                  Ship
                </button>

                <button
                  onClick={() => changeStatus(order._id, "Delivered")}
                  className="rounded-xl bg-emerald-100 py-2 font-medium text-emerald-700"
                >
                  Deliver
                </button>

                <button
                  onClick={() => changeStatus(order._id, "Cancelled")}
                  className="rounded-xl bg-red-100 py-2 font-medium text-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Accepted: "bg-blue-100 text-blue-700",
    Preparing: "bg-purple-100 text-purple-700",
    Shipping: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
