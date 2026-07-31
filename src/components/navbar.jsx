import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // Detect login/logout changes
  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");

      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.dispatchEvent(new Event("storage"));

    navigate("/");
  };

  return (
    <header
      className={`
      fixed left-1/2 top-4 z-[1000]
      flex items-center justify-between
      w-[70%] max-w-[1400px]
      -translate-x-1/2
      rounded-[60px]
      border
      px-10 py-1
      transition-all duration-300

      lg:w-[95%]
      md:w-[96%]
      md:rounded-[18px]
      max-[480px]:w-[97%]

      ${
        scrolled
          ? "bg-[rgba(15,15,15,.92)] shadow-xl"
          : "border-white/10 bg-white/5 backdrop-blur-xl"
      }
      `}
    >
      {/* LOGO */}

      <HashLink smooth to="/#home" onClick={closeMenu}>
        <img
          src="/assets/images/kuraz.png"
          alt="Kuraz"
          className="
          w-[90px]
          lg:w-[80px]
          md:w-[58px]
          "
        />
      </HashLink>

      {/* NAVIGATION */}

      <nav
        className={`
        absolute
        left-1/2
        top-[65px]
        w-[92%]
        -translate-x-1/2

        rounded-2xl

        bg-[#111]/95
        border border-white/10

        backdrop-blur-xl

        transition-all

        ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}

        lg:static
        lg:flex
        lg:w-auto
        lg:translate-x-0
        lg:opacity-100
        lg:visible
        lg:bg-transparent
        lg:border-0
        `}
      >
        <div
          className="
          flex flex-col p-3
          lg:flex-row
          lg:gap-8
          lg:p-0
          "
        >
          <NavItem text="Home" link="/#home" hash close={closeMenu} />

          <NavItem text="About" link="/#about" hash close={closeMenu} />

          <NavItem
            text="Collection"
            link="/#collection"
            hash
            close={closeMenu}
          />

          <NavItem
            text="Contact"
            link="/#contact-section"
            hash
            close={closeMenu}
          />

          {/* NOT LOGGED IN */}

          {!user && (
            <>
              <NavItem text="Login" link="/signin" close={closeMenu} />
            </>
          )}

          {/* ADMIN */}

          {user?.role === "admin" && (
            <NavItem text="Admin Dashboard" link="/admin" close={closeMenu} />
          )}

          {/* LOGOUT */}

          {user && (
            <button
              onClick={logout}
              className="
              text-left
              rounded-xl
              px-4
              py-3
              text-red-400
              font-medium

              hover:bg-red-500
              hover:text-white

              lg:p-0
              "
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-4">
        {/* Phone */}

        <a
          href="tel:+251937398157"
          className="
          text-white
          transition
          hover:text-[#d4af37]
          "
        >
          <img
            src="/assets/icons/telephone.png"
            alt="call"
            className="
            h-7
            w-7
            "
          />
        </a>

        {/* Profile Icon */}

        {user && user.role !== "admin" && (
          <Link
            to="/profile"
            title="My Profile"
            className="
            flex
            items-center
            justify-center
            text-white
            transition-all
            duration-300
            hover:text-[#d4af37]
            hover:scale-110
            "
          >
            <FaUserCircle
              className="
              text-[30px]
              sm:text-[32px]
              lg:text-[34px]
              "
            />
          </Link>
        )}

        {/* Mobile Menu */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
          lg:hidden
          text-white
          text-2xl
          "
        >
          ☰
        </button>
      </div>
    </header>
  );
}

function NavItem({ text, link, hash, close }) {
  const classes = `
  rounded-xl
  px-4
  py-3

  text-white
  font-medium

  transition

  hover:text-[#d4af37]

  lg:p-0
  `;

  if (hash) {
    return (
      <HashLink smooth to={link} onClick={close} className={classes}>
        {text}
      </HashLink>
    );
  }

  return (
    <Link to={link} onClick={close} className={classes}>
      {text}
    </Link>
  );
}
