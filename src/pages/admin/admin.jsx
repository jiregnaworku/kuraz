import { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaSpinner,
  FaShoppingCart,
  FaStore,
  FaUserFriends,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { getOrders } from "../../api/OrderApi";
import { getUsers } from "../../api/userApi";
import { useLanguage } from "../../context/LanguageContext";

export default function Admin() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [productsData, ordersData, usersData] = await Promise.all([
          getProducts(),
          getOrders(),
          getUsers(),
        ]);

        // Calculate revenue from orders
        const totalRevenue =
          ordersData?.reduce((sum, order) => {
            return sum + (Number(order.totalPrice) || 0);
          }, 0) || 0;

        setStats({
          products: productsData?.length || 0,
          orders: ordersData?.length || 0,
          users: usersData?.length || 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#224248] px-4 pt-8 pb-4 sm:px-5 lg:px-10">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {t("admin.dashboard")}
          </h1>

          <p className="mt-1 text-sm text-gray-300 sm:text-base">
            {t("admin.welcomeBackAdmin")}
          </p>
        </div>

        <div className="rounded-xl bg-[#1a3338] px-5 py-3 text-white shadow-lg border border-white/10">
          <p className="text-xs text-gray-300">{t("admin.today")}</p>

          <p className="font-semibold">{t("admin.adminOverview")}</p>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t("admin.totalProducts")}
          number={stats.products}
          icon={<FaBoxOpen />}
          loading={loading}
          bgGradient="from-blue-500 to-blue-600"
          iconBg="bg-blue-500/20 text-blue-400"
          numberColor="text-blue-400"
        />

        <StatCard
          title={t("admin.totalOrders")}
          number={stats.orders}
          icon={<FaShoppingBag />}
          loading={loading}
          bgGradient="from-purple-500 to-purple-600"
          iconBg="bg-purple-500/20 text-purple-400"
          numberColor="text-purple-400"
        />

        <StatCard
          title={t("admin.totalCustomers")}
          number={stats.users}
          icon={<FaUsers />}
          loading={loading}
          bgGradient="from-green-500 to-green-600"
          iconBg="bg-green-500/20 text-green-400"
          numberColor="text-green-400"
        />

        <StatCard
          title={t("admin.totalRevenue")}
          number={`${stats.revenue.toLocaleString()} ETB`}
          icon={<FaChartLine />}
          loading={loading}
          bgGradient="from-[#d4af37] to-[#b88f1d]"
          iconBg="bg-[#d4af37]/20 text-[#d4af37]"
          numberColor="text-[#d4af37]"
        />
      </div>

      {/* Quick Actions */}

      <section className="mt-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          {t("admin.quickActions")}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            to="/admin/products"
            icon={<FaStore />}
            title={t("admin.manageProducts")}
            text={t("admin.manageProductsDesc")}
            gradient="from-blue-600 to-blue-700"
          />

          <ActionCard
            to="/admin/orders"
            icon={<FaShoppingCart />}
            title={t("admin.manageOrders")}
            text={t("admin.manageOrdersDesc")}
            gradient="from-purple-600 to-purple-700"
          />

          <ActionCard
            to="/admin/users"
            icon={<FaUserFriends />}
            title={t("admin.manageUsers")}
            text={t("admin.manageUsersDesc")}
            gradient="from-green-600 to-green-700"
          />
        </div>
      </section>

      {/* Recent Activity */}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {t("admin.recentActivity")}
          </h2>

          <button className="flex items-center gap-2 text-sm text-[#d4af37] transition hover:scale-105 hover:underline">
            {t("admin.viewAll")}
            <FaArrowRight />
          </button>
        </div>

        <div className="flex min-h-40 items-center justify-center rounded-xl bg-white/5 text-center text-sm text-gray-400">
          {t("admin.noRecentActivity")}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  number,
  icon,
  loading,
  bgGradient,
  iconBg,
  numberColor,
}) {
  const { t } = useLanguage();

  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-2xl
      bg-white/10
      p-6
      shadow-[0_12px_40px_rgba(0,0,0,0.15)]
      transition-all
      duration-300
      hover:-translate-y-2
      hover:shadow-2xl
      border
      border-white/10
      backdrop-blur-sm
    "
    >
      {/* Animated Gradient Background */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${bgGradient}
          opacity-0 transition-opacity duration-500
          group-hover:opacity-[0.08]
        `}
      />

      {/* Decorative Circle */}
      <div
        className={`
          absolute -right-8 -top-8 h-24 w-24 rounded-full
          bg-gradient-to-br ${bgGradient}
          opacity-[0.05] transition-all duration-500
          group-hover:scale-150 group-hover:opacity-[0.1]
        `}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`
              flex h-14 w-14 items-center justify-center rounded-2xl
              ${iconBg} transition-all duration-300
              group-hover:scale-110 group-hover:shadow-lg
            `}
          >
            <span className="text-2xl">{icon}</span>
          </div>

          {/* Trend Indicator */}
          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
            +12%
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-gray-300">{title}</p>

          {loading ? (
            <div className="mt-1 flex items-center gap-2">
              <FaSpinner className="animate-spin text-[#d4af37]" />
              <span className="text-sm text-gray-400">
                {t("common.loading")}
              </span>
            </div>
          ) : (
            <h3
              className={`mt-1 text-3xl font-bold ${numberColor} transition-all duration-300 group-hover:scale-105`}
            >
              {number}
            </h3>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 w-full rounded-full bg-white/10">
          <div
            className={`
              h-1 rounded-full bg-gradient-to-r ${bgGradient}
              transition-all duration-1000
            `}
            style={{ width: loading ? "0%" : "75%" }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ to, icon, title, text, gradient }) {
  const { t } = useLanguage();

  return (
    <Link
      to={to}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradient}
        p-6 text-white
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
        border border-white/10
      `}
    >
      {/* Decorative Elements */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/5 transition-all duration-500 group-hover:scale-150" />
      <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-white/5 transition-all duration-500 group-hover:scale-150" />

      <div className="relative">
        <div
          className="
          mb-4
          text-5xl
          transition-transform
          duration-300
          group-hover:scale-110
          group-hover:rotate-3
        "
        >
          {icon}
        </div>

        <h3 className="text-xl font-bold">{title}</h3>

        <p className="mt-2 text-sm text-white/80">{text}</p>

        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/70 transition-all duration-300 group-hover:text-white group-hover:gap-3">
          <span>{t("admin.getStarted")}</span>
          <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
