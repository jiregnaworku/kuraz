import {
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function Admin() {
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

        <div className="rounded-xl bg-[#24312c] px-5 py-3 text-white">
          <p className="text-xs text-gray-300">Today</p>

          <p className="font-semibold">Admin Overview</p>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Products" number="0" icon={<FaBoxOpen />} />

        <StatCard title="Orders" number="0" icon={<FaShoppingBag />} />

        <StatCard title="Customers" number="0" icon={<FaUsers />} />

        <StatCard title="Revenue" number="0 ETB" icon={<FaChartLine />} />
      </div>

      {/* Quick Actions */}

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-[#24312c]">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            to="/admin/products"
            icon={<FaBoxOpen />}
            title="Manage Products"
            text="Create and manage your dress collection."
          />

          <ActionCard
            to="/admin/orders"
            icon={<FaShoppingBag />}
            title="Manage Orders"
            text="Track customer orders and deliveries."
          />

          <ActionCard
            to="/admin/users"
            icon={<FaUsers />}
            title="Manage Users"
            text="View and control customer accounts."
          />
        </div>
      </section>

      {/* Recent Activity */}

      <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#24312c]">Recent Activity</h2>

          <button className="flex items-center gap-2 text-sm text-[#d4af37] hover:underline">
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

function StatCard({ title, number, icon }) {
  return (
    <div
      className="
      rounded-2xl
      border
      bg-white
      p-5
      shadow-sm
      transition
      hover:-translate-y-1
      hover:shadow-lg
    "
    >
      <div
        className="
        mb-4
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        bg-[#24312c]
        text-xl
        text-[#d4af37]
      "
      >
        {icon}
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="mt-1 text-3xl font-bold text-[#24312c]">{number}</h3>
    </div>
  );
}

function ActionCard({ to, icon, title, text }) {
  return (
    <Link
      to={to}
      className="
      group
      rounded-2xl
      bg-[#24312c]
      p-6
      text-white
      transition
      hover:-translate-y-1
      hover:shadow-xl
    "
    >
      <div
        className="
        mb-5
        text-4xl
        text-[#d4af37]
        transition-transform
        duration-300
        group-hover:scale-110
      "
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-2 text-sm text-gray-300">{text}</p>
    </Link>
  );
}
