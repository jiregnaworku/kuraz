import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import OrderCard from "../../components/profile/OrderCard";
import { getMyOrders } from "../../api/OrderApi";
import { useLanguage } from "../../context/LanguageContext";

export default function UserOrders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
          setError(
            t("orders.loginRequired") || "Please login to view your orders",
          );
          setLoading(false);
          // Redirect to login after a moment
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
          return;
        }

        const data = await getMyOrders();

        // The API returns an array of orders directly
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders:", error);

        // Handle different error cases
        if (error.response?.status === 401) {
          setError(
            t("orders.sessionExpired") ||
              "Session expired. Please login again.",
          );
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else if (error.response?.status === 404) {
          setError(t("orders.noOrdersFound") || "No orders found.");
        } else {
          setError(
            t("orders.loadFailed") ||
              "Failed to load orders. Please try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, t]);

  // Handle retry
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
        <p className="mt-4 text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 px-4">
        <div className="mb-4 text-5xl text-red-400">⚠️</div>
        <h3 className="text-lg font-semibold text-red-600">
          {t("orders.errorTitle") || "Oops! Something went wrong"}
        </h3>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-6 rounded-xl bg-[#d4af37] px-6 py-2.5 font-medium text-white transition hover:bg-[#b88f1d]"
        >
          {t("orders.tryAgain") || "Try Again"}
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#24312c]">
            {t("orders.myOrders")}
          </h1>
          <p className="mt-2 text-gray-500">{t("orders.trackOrders")}</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 py-16 px-4">
          <FaBoxOpen className="mb-4 text-6xl text-[#d4af37]/60" />
          <h3 className="text-xl font-semibold text-[#24312c]">
            {t("orders.noOrders")}
          </h3>
          <p className="mt-2 text-gray-500">{t("orders.noOrdersMessage")}</p>
          <button
            onClick={() => navigate("/home")}
            className="mt-6 rounded-xl bg-[#d4af37] px-6 py-2.5 font-medium text-white transition hover:bg-[#b88f1d]"
          >
            {t("orders.startShopping")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#24312c]">
              {t("orders.myOrders")}
            </h1>
            <p className="mt-2 text-gray-500">{t("orders.trackOrders")}</p>
          </div>
          <div className="rounded-full bg-[#d4af37]/10 px-4 py-2 text-sm font-medium text-[#d4af37]">
            {orders.length}{" "}
            {orders.length === 1
              ? t("orders.order") || "Order"
              : t("orders.orders") || "Orders"}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard key={order._id || order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
