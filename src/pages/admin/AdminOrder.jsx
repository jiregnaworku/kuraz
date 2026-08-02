import { useCallback, useEffect, useState } from "react";
import {
  FaCheck,
  FaTruck,
  FaTimes,
  FaShoppingBag,
  FaSearch,
  FaPrint,
  FaDownload,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaPhone,
  FaTag,
  FaClock,
  FaBox,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getOrders, updateOrderStatus } from "../../api/OrderApi";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../components/profile/ConfirmModal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");

  const statusOptions = [
    "All",
    "Pending",
    "Accepted",
    "Preparing",
    "Shipping",
    "Delivered",
    "Cancelled",
  ];

  // ===============================
  // Fetch Orders
  // ===============================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  // ===============================
  // Filter and Search
  // ===============================

  useEffect(() => {
    let result = [...orders];

    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    // Search by customer name, order number, or product name
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(term) ||
          order.customer?.fullName?.toLowerCase().includes(term) ||
          order.product?.name?.toLowerCase().includes(term) ||
          order.productName?.toLowerCase().includes(term) ||
          order.phone?.includes(term),
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "createdAt") {
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
        }

        if (sortConfig.key === "totalPrice") {
          aVal = Number(a.totalPrice);
          bVal = Number(b.totalPrice);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm, sortConfig]);

  // ===============================
  // Open Status Change Modal
  // ===============================

  const openStatusModal = (order, newStatus) => {
    // Don't show modal if status is the same
    if (order.orderStatus === newStatus) {
      toast.info(`Order is already ${newStatus}`);
      return;
    }

    setSelectedOrder(order);
    setPendingStatus(newStatus);
    setShowStatusModal(true);
  };

  // ===============================
  // Update Order Status (Confirmed)
  // ===============================

  const handleStatusChange = async () => {
    if (!selectedOrder || !pendingStatus) return;

    try {
      await updateOrderStatus(selectedOrder._id, { status: pendingStatus });
      toast.success(`Order status updated to ${pendingStatus}`);
      setShowStatusModal(false);
      setSelectedOrder(null);
      setPendingStatus("");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  // ===============================
  // Cancel Status Change
  // ===============================

  const cancelStatusChange = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    setPendingStatus("");
  };

  // ===============================
  // Toggle Sort
  // ===============================

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ===============================
  // Get Status Color
  // ===============================

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Accepted: "bg-blue-100 text-blue-800 border-blue-200",
      Preparing: "bg-purple-100 text-purple-800 border-purple-200",
      Shipping: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // ===============================
  // Get Status Icon
  // ===============================

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <FaClock className="text-yellow-600" />,
      Accepted: <FaCheck className="text-blue-600" />,
      Preparing: <FaBox className="text-purple-600" />,
      Shipping: <FaTruck className="text-indigo-600" />,
      Delivered: <FaCheck className="text-green-600" />,
      Cancelled: <FaTimes className="text-red-600" />,
    };
    return icons[status] || <FaClock className="text-gray-600" />;
  };

  // ===============================
  // Get Status Button Style
  // ===============================

  const getStatusButtonStyle = (status) => {
    const styles = {
      Accepted: "bg-green-100 text-green-700 hover:bg-green-200",
      Preparing: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      Shipping: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      Delivered: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
      Cancelled: "bg-red-100 text-red-700 hover:bg-red-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
  };

  // ===============================
  // Order Stats
  // ===============================

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter((o) => o.orderStatus === "Pending").length;
    const shipping = orders.filter((o) => o.orderStatus === "Shipping").length;
    const delivered = orders.filter(
      (o) => o.orderStatus === "Delivered",
    ).length;
    const cancelled = orders.filter(
      (o) => o.orderStatus === "Cancelled",
    ).length;
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.totalPrice), 0);

    return { total, pending, shipping, delivered, cancelled, totalRevenue };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6f8] to-[#e8e9ec] px-4 pt-28 pb-10 sm:px-6 lg:px-10">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#24312c]">
              Orders Management
            </h1>
            <p className="mt-1 text-gray-500">
              Manage and track all customer orders
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              <FaPrint /> Print
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              <FaDownload /> Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-[#24312c]">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Shipping</p>
            <p className="text-2xl font-bold text-indigo-600">
              {stats.shipping}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b88f1d] p-4 text-white shadow-sm">
            <p className="text-xs text-white/80">Revenue</p>
            <p className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString()} ETB
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-[#d4af37] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#d4af37] focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden overflow-hidden rounded-3xl bg-white shadow-xl lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#24312c]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Product
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:text-[#d4af37]"
                  onClick={() => toggleSort("totalPrice")}
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortConfig.key === "totalPrice" &&
                      (sortConfig.direction === "asc" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Status
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:text-[#d4af37]"
                  onClick={() => toggleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-500">
                    <FaShoppingBag className="mx-auto mb-4 text-4xl text-gray-300" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-[#24312c]">
                        {order.orderNumber || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#24312c]">
                        {order.customer?.fullName || "Customer"}
                      </p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.productImage && (
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-[#24312c]">
                            {order.product?.name || order.productName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.size} • {order.color}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#d4af37]">
                      {Number(order.totalPrice).toLocaleString()} ETB
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => openStatusModal(order, "Accepted")}
                          className={`rounded-lg p-2 transition hover:scale-105 ${getStatusButtonStyle("Accepted")}`}
                          title="Accept"
                          disabled={
                            order.orderStatus === "Accepted" ||
                            order.orderStatus === "Cancelled" ||
                            order.orderStatus === "Delivered"
                          }
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => openStatusModal(order, "Preparing")}
                          className={`rounded-lg p-2 transition hover:scale-105 ${getStatusButtonStyle("Preparing")}`}
                          title="Prepare"
                          disabled={
                            order.orderStatus === "Cancelled" ||
                            order.orderStatus === "Delivered"
                          }
                        >
                          <FaBox />
                        </button>
                        <button
                          onClick={() => openStatusModal(order, "Shipping")}
                          className={`rounded-lg p-2 transition hover:scale-105 ${getStatusButtonStyle("Shipping")}`}
                          title="Ship"
                          disabled={
                            order.orderStatus === "Cancelled" ||
                            order.orderStatus === "Delivered"
                          }
                        >
                          <FaTruck />
                        </button>
                        <button
                          onClick={() => openStatusModal(order, "Delivered")}
                          className={`rounded-lg p-2 transition hover:scale-105 ${getStatusButtonStyle("Delivered")}`}
                          title="Deliver"
                          disabled={
                            order.orderStatus === "Cancelled" ||
                            order.orderStatus === "Delivered"
                          }
                        >
                          <FaCheck className="text-emerald-700" />
                        </button>
                        <button
                          onClick={() => openStatusModal(order, "Cancelled")}
                          className={`rounded-lg p-2 transition hover:scale-105 ${getStatusButtonStyle("Cancelled")}`}
                          title="Cancel"
                          disabled={
                            order.orderStatus === "Cancelled" ||
                            order.orderStatus === "Delivered"
                          }
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
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            <FaShoppingBag className="mx-auto mb-4 text-4xl text-gray-300" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-white p-5 shadow-lg">
              {/* Order Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-[#24312c]">
                    {order.orderNumber || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                >
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus}
                </span>
              </div>

              {/* Order Content */}
              <div className="mt-3 flex items-center gap-4">
                {order.productImage && (
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-[#24312c]">
                    {order.product?.name || order.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.size} • {order.color} • Qty: {order.quantity}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-3 rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <FaUser className="text-gray-400" />
                  <span className="font-medium">
                    {order.customer?.fullName || "Customer"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaPhone className="text-gray-400" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaTag className="text-gray-400" />
                  <span>{order.paymentMethod}</span>
                </div>
              </div>

              {/* Order Footer */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-[#d4af37]">
                    {Number(order.totalPrice).toLocaleString()} ETB
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                <button
                  onClick={() => openStatusModal(order, "Accepted")}
                  className={`rounded-xl py-2 text-xs font-medium transition hover:scale-105 ${getStatusButtonStyle("Accepted")}`}
                  disabled={
                    order.orderStatus === "Accepted" ||
                    order.orderStatus === "Cancelled" ||
                    order.orderStatus === "Delivered"
                  }
                >
                  Accept
                </button>
                <button
                  onClick={() => openStatusModal(order, "Preparing")}
                  className={`rounded-xl py-2 text-xs font-medium transition hover:scale-105 ${getStatusButtonStyle("Preparing")}`}
                  disabled={
                    order.orderStatus === "Cancelled" ||
                    order.orderStatus === "Delivered"
                  }
                >
                  Prepare
                </button>
                <button
                  onClick={() => openStatusModal(order, "Shipping")}
                  className={`rounded-xl py-2 text-xs font-medium transition hover:scale-105 ${getStatusButtonStyle("Shipping")}`}
                  disabled={
                    order.orderStatus === "Cancelled" ||
                    order.orderStatus === "Delivered"
                  }
                >
                  Ship
                </button>
                <button
                  onClick={() => openStatusModal(order, "Delivered")}
                  className={`rounded-xl py-2 text-xs font-medium transition hover:scale-105 ${getStatusButtonStyle("Delivered")}`}
                  disabled={
                    order.orderStatus === "Cancelled" ||
                    order.orderStatus === "Delivered"
                  }
                >
                  Deliver
                </button>
                <button
                  onClick={() => openStatusModal(order, "Cancelled")}
                  className={`rounded-xl py-2 text-xs font-medium transition hover:scale-105 ${getStatusButtonStyle("Cancelled")}`}
                  disabled={
                    order.orderStatus === "Cancelled" ||
                    order.orderStatus === "Delivered"
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status Change Confirmation Modal */}
      <ConfirmModal
        isOpen={showStatusModal}
        onConfirm={handleStatusChange}
        onCancel={cancelStatusChange}
        title={`Change Order Status to ${pendingStatus}`}
        message={
          pendingStatus === "Cancelled"
            ? `Are you sure you want to cancel order #${selectedOrder?.orderNumber || "N/A"}? This action cannot be undone.`
            : `Are you sure you want to change order #${selectedOrder?.orderNumber || "N/A"} status from "${selectedOrder?.orderStatus}" to "${pendingStatus}"?`
        }
        confirmText={`Change to ${pendingStatus}`}
        cancelText="Cancel"
        type={pendingStatus === "Cancelled" ? "danger" : "warning"}
        icon={
          pendingStatus === "Cancelled" ? (
            <FaTimes className="text-3xl text-red-600" />
          ) : pendingStatus === "Delivered" ? (
            <FaCheck className="text-3xl text-green-600" />
          ) : (
            <FaExclamationTriangle className="text-3xl text-yellow-600" />
          )
        }
      />

      {/* Pagination (if needed) */}
      {filteredOrders.length > 10 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50">
            Previous
          </button>
          <button className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-medium text-white">
            1
          </button>
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50">
            2
          </button>
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50">
            3
          </button>
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
