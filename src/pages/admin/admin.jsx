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

export default function Admin() {
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
    <div className="min-h-screen bg-[#f5f6f8] px-4 pt-6 pb-10 sm:px-6 lg:px-10">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#24312c] sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Welcome back to Kuraz Design Admin Panel
          </p>
        </div>

        <div className="rounded-xl bg-[#24312c] px-5 py-3 text-white shadow-lg">
          <p className="text-xs text-gray-300">Today</p>

          <p className="font-semibold">Admin Overview</p>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Products"
          number={stats.products}
          icon={<FaBoxOpen />}
          loading={loading}
          bgGradient="from-blue-500 to-blue-600"
          iconBg="bg-blue-100 text-blue-600"
          numberColor="text-blue-700"
        />

        <StatCard
          title="Orders"
          number={stats.orders}
          icon={<FaShoppingBag />}
          loading={loading}
          bgGradient="from-purple-500 to-purple-600"
          iconBg="bg-purple-100 text-purple-600"
          numberColor="text-purple-700"
        />

        <StatCard
          title="Customers"
          number={stats.users}
          icon={<FaUsers />}
          loading={loading}
          bgGradient="from-green-500 to-green-600"
          iconBg="bg-green-100 text-green-600"
          numberColor="text-green-700"
        />

        <StatCard
          title="Revenue"
          number={`${stats.revenue.toLocaleString()} ETB`}
          icon={<FaChartLine />}
          loading={loading}
          bgGradient="from-[#d4af37] to-[#b88f1d]"
          iconBg="bg-yellow-100 text-yellow-600"
          numberColor="text-[#d4af37]"
        />
      </div>

      {/* Quick Actions */}

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-[#24312c]">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            to="/admin/products"
            icon={<FaStore />}
            title="Manage Products"
            text="Create and manage your dress collection."
            gradient="from-blue-600 to-blue-700"
          />

          <ActionCard
            to="/admin/orders"
            icon={<FaShoppingCart />}
            title="Manage Orders"
            text="Track customer orders and deliveries."
            gradient="from-purple-600 to-purple-700"
          />

          <ActionCard
            to="/admin/users"
            icon={<FaUserFriends />}
            title="Manage Users"
            text="View and control customer accounts."
            gradient="from-green-600 to-green-700"
          />
        </div>
      </section>

      {/* Recent Activity */}

      <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#24312c]">Recent Activity</h2>

          <button className="flex items-center gap-2 text-sm text-[#d4af37] transition hover:scale-105 hover:underline">
            View all
            <FaArrowRight />
          </button>
        </div>

        <div className="flex min-h-40 items-center justify-center rounded-xl bg-gray-50 text-center text-sm text-gray-400">
          No recent activity yet.
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
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-2xl
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-2
      hover:shadow-2xl
      border
      border-gray-100
    "
    >
      {/* Animated Gradient Background */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${bgGradient}
          opacity-0 transition-opacity duration-500
          group-hover:opacity-[0.04]
        `}
      />

      {/* Decorative Circle */}
      <div
        className={`
          absolute -right-8 -top-8 h-24 w-24 rounded-full
          bg-gradient-to-br ${bgGradient}
          opacity-[0.03] transition-all duration-500
          group-hover:scale-150 group-hover:opacity-[0.06]
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

          {/* Trend Indicator (optional) */}
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            +12%
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          {loading ? (
            <div className="mt-1 flex items-center gap-2">
              <FaSpinner className="animate-spin text-[#d4af37]" />
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : (
            <h3
              className={`mt-1 text-3xl font-bold ${numberColor} transition-all duration-300 group-hover:scale-105`}
            >
              {number}
            </h3>
          )}
        </div>

        {/* Progress Bar (optional) */}
        <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
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
  return (
    <Link
      to={to}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradient}
        p-6 text-white
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
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
          <span>Get Started</span>
          <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
