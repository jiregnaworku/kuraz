import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaShoppingBag,
  FaBoxOpen,
  FaUsers,
  FaComments,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const admin = JSON.parse(localStorage.getItem("user") || "null");

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FaShoppingBag />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <FaBoxOpen />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: <FaComments />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/signin");
  };

  return (
    <>
      <header
        className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-white/10
        bg-[#1b2b26]/95
        backdrop-blur-xl
        shadow-lg
        "
      >
        <div
          className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
          "
        >
          {/* Logo */}

          <Link
            to="/admin"
            className="
            text-2xl
            font-bold
            tracking-wide
            text-[#d4af37]
            "
          >
            Kuraz Admin
          </Link>

          {/* Desktop Navigation */}

          <nav
            className="
            hidden
            items-center
            gap-2
            lg:flex
            "
          >
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-[#d4af37] text-[#1b2b26] shadow-md"
                      : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                  }
                  `
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right */}

          <div
            className="
            hidden
            items-center
            gap-3
            lg:flex
            "
          >
            <Link
              to="/admin/notifications"
              className="
              rounded-xl
              p-3
              text-gray-200
              transition
              hover:bg-white/10
              hover:text-[#d4af37]
              "
            >
              <FaBell size={18} />
            </Link>

            <Link
              to="/admin/profile"
              className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-white/5
              px-3
              py-2
              transition
              hover:bg-white/10
              "
            >
              <FaUserCircle className="text-[#d4af37]" size={30} />

              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  {admin?.fullName || "Admin"}
                </p>

                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="
              rounded-xl
              bg-red-500/10
              p-3
              text-red-400
              transition
              hover:bg-red-500
              hover:text-white
              "
            >
              <FaSignOutAlt />
            </button>
          </div>

          {/* Mobile */}

          <button
            onClick={() => setOpen(!open)}
            className="
            rounded-xl
            p-3
            text-white
            hover:bg-white/10
            lg:hidden
            "
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}

      <div
        className={`
        fixed
        top-0
        right-0
        z-50
        h-screen
        w-72
        bg-[#1b2b26]
        shadow-2xl
        transition-transform
        duration-300
        lg:hidden

        ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-xl font-bold text-[#d4af37]">Admin Menu</h2>

          <button onClick={() => setOpen(false)} className="text-white">
            <FaTimes />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-8 flex items-center gap-3">
            <FaUserCircle size={50} className="text-[#d4af37]" />

            <div>
              <h3 className="font-semibold text-white">
                {admin?.fullName || "Admin"}
              </h3>

              <p className="text-sm text-gray-400">Administrator</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                end={item.end}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  transition

                  ${
                    isActive
                      ? "bg-[#d4af37] text-[#1b2b26]"
                      : "text-gray-200 hover:bg-white/10"
                  }
                  `
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}

            <NavLink
              to="/admin/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-200 transition hover:bg-white/10"
            >
              <FaBell />
              Notifications
            </NavLink>

            <NavLink
              to="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-200 transition hover:bg-white/10"
            >
              <FaUserCircle />
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="
              mt-4
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              bg-red-500/10
              px-4
              py-3
              text-red-400
              transition
              hover:bg-red-500
              hover:text-white
              "
            >
              <FaSignOutAlt />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          z-40
          bg-black/40
          lg:hidden
          "
        />
      )}
    </>
  );
}
