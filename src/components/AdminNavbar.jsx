import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaBell,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
} from "react-icons/fa";

import { useState } from "react";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
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
      name: "Notifications",
      path: "/admin/notifications",
      icon: <FaBell />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/");
  };

  return (
    <>
      <header
        className="
        fixed
        top-0
        left-0
        z-50
        flex
        h-20
        w-full
        items-center
        justify-between
        border-b
        border-white/10
        bg-[#12211d]/95
        px-4
        shadow-lg
        backdrop-blur-md
        sm:px-6
        lg:px-10
        "
      >
        {/* Logo */}

        <Link
          to="/admin"
          className="
          text-xl
          font-bold
          text-[#d4af37]
          sm:text-2xl
          "
        >
          Kuraz Admin
        </Link>

        {/* Desktop Menu */}

        <nav
          className="
          hidden
          items-center
          gap-2
          lg:flex
          "
        >
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
              flex
              items-center
              gap-2
              rounded-xl
              px-4
              py-2
              text-sm
              transition

              ${
                location.pathname === item.path
                  ? "bg-[#d4af37] text-[#12211d]"
                  : "text-white hover:bg-white/10 hover:text-[#d4af37]"
              }
              `}
            >
              {item.icon}

              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}

        <div
          className="
          flex
          items-center
          gap-3
          "
        >
          {/* Desktop Logout */}

          <button
            onClick={handleLogout}
            className="
            hidden
            items-center
            gap-2
            rounded-xl
            px-4
            py-2
            text-red-400
            transition
            hover:bg-red-500/10
            sm:flex
            "
          >
            <FaSignOutAlt />

            <span>Logout</span>
          </button>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setOpen(!open)}
            className="
            rounded-xl
            p-3
            text-white
            transition
            hover:bg-white/10
            lg:hidden
            "
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}

      {open && (
        <div
          className="
          fixed
          left-0
          top-20
          z-40
          w-full
          border-b
          border-white/10
          bg-[#12211d]
          p-4
          shadow-xl
          lg:hidden
          "
        >
          <nav
            className="
            flex
            flex-col
            gap-2
            "
          >
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-white
                transition

                ${
                  location.pathname === item.path
                    ? "bg-[#d4af37] text-[#12211d]"
                    : "hover:bg-white/10"
                }

                `}
              >
                {item.icon}

                {item.name}
              </Link>
            ))}

            {/* Mobile Logout */}

            <button
              onClick={handleLogout}
              className="
              mt-2
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-red-400
              transition
              hover:bg-red-500/10
              "
            >
              <FaSignOutAlt />
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
