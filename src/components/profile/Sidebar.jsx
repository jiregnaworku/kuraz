import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaShoppingBag,
  FaComments,
  FaBell,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
      end: true,
    },

    {
      name: "My Orders",
      path: "/profile/orders",
      icon: <FaShoppingBag />,
    },

    {
      name: "Messages",
      path: "/profile/messages",
      icon: <FaComments />,
    },

    {
      name: "Notifications",
      path: "/profile/notifications",
      icon: <FaBell />,
    },

    {
      name: "Settings",
      path: "/profile/settings",
      icon: <FaCog />,
    },
  ];

  // ==========================
  // LOGOUT
  // ==========================

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/signin");
  };

  return (
    <>
      {/* MOBILE BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="
        fixed
        left-5
        top-5
        z-[1000]

        flex
        h-12
        w-12
        items-center
        justify-center

        rounded-full

        bg-[#24312c]

        text-xl
        text-[#d4af37]

        shadow-lg

        lg:hidden
        "
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* OVERLAY MOBILE */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          z-[998]
          bg-black/40
          lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
        fixed
        left-0
        top-0
        z-[999]

        h-screen
        w-72

        bg-[#24312c]

        p-6

        shadow-2xl

        transition-transform
        duration-300


        lg:static
        lg:h-fit
        lg:rounded-3xl
        lg:translate-x-0


        ${open ? "translate-x-0" : "-translate-x-full"}

        `}
      >
        {/* HEADER */}

        <div
          className="
          mb-8
          text-center
          "
        >
          <div
            className="
            mx-auto
            flex
            h-20
            w-20

            items-center
            justify-center

            rounded-full

            bg-white

            text-3xl
            text-[#d4af37]

            "
          >
            <FaUser />
          </div>

          <h2
            className="
            mt-4
            text-xl
            font-bold
            text-white
            "
          >
            My Account
          </h2>

          <p
            className="
            mt-1
            text-sm
            text-gray-300
            "
          >
            Manage your account
          </p>
        </div>

        {/* MENU */}

        <nav
          className="
          space-y-3
          "
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4

                rounded-xl

                px-4
                py-3

                font-medium

                transition


                ${
                  isActive
                    ? "bg-[#d4af37] text-white"
                    : "text-gray-200 hover:bg-white/10 hover:text-[#d4af37]"
                }

                `
              }
            >
              <span className="text-lg">{item.icon}</span>

              {item.name}
            </NavLink>
          ))}

          {/* LOGOUT */}

          <button
            onClick={logout}
            className="
            flex
            w-full
            items-center
            gap-4

            rounded-xl

            px-4
            py-3

            font-medium

            text-red-300

            transition

            hover:bg-red-500/20
            hover:text-red-400
            "
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
