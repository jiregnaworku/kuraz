import { Link, useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaLock, FaSignInAlt } from "react-icons/fa";
import { useState } from "react";
import API from "../api/api";

export default function Signin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/auth/login", {
        phone: formData.phone,
        password: formData.password,
      });

      // Save authentication data

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update Navbar immediately

      window.dispatchEvent(new Event("storage"));

      setMessage("Login successful");

      setTimeout(() => {
        const user = response.data.user;

        // Check if user came from order button

        const redirectPath = localStorage.getItem("redirectAfterLogin");

        if (redirectPath && redirectPath.startsWith("/order/")) {
          localStorage.removeItem("redirectAfterLogin");

          navigate(redirectPath);

          return;
        }

        // Remove old redirects

        localStorage.removeItem("redirectAfterLogin");

        // Admin

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          // Normal user

          navigate("/");
        }
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Check your information.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
      relative flex min-h-screen items-center justify-center
      overflow-hidden
      bg-cover bg-center
      px-6
      pt-36 pb-12
      md:pt-40
      lg:pt-44
      "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />

      <div
        className="
        absolute left-10 top-24
        h-44 w-44
        rounded-full
        bg-[#d4af37]/20
        blur-3xl
        animate-pulse
        "
      />

      <div
        className="
        absolute bottom-20 right-10
        h-60 w-60
        rounded-full
        bg-emerald-500/20
        blur-3xl
        animate-pulse
        "
      />

      <div
        className="
        relative z-10
        w-full max-w-md
        rounded-[30px]
        border border-white/20
        bg-white/10
        p-8
        shadow-[0_25px_90px_rgba(0,0,0,.55)]
        backdrop-blur-2xl
        max-[480px]:rounded-[22px]
        max-[480px]:p-5
        "
      >
        <div className="mb-8 text-center">
          <img
            src="/assets/images/kuraz.png"
            alt="Kuraz Logo"
            className="
            mx-auto
            mb-5
            w-24
            max-[480px]:w-20
            "
          />

          <h1
            className="
            text-4xl
            font-bold
            text-white
            max-[480px]:text-3xl
            "
          >
            Welcome Back
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-300">
            Login to your Kuraz Design account and continue your fashion
            journey.
          </p>
        </div>

        {message && (
          <p
            className="
            mb-5
            text-center
            text-sm
            font-semibold
            text-[#d4af37]
            "
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone */}

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Phone Number
            </label>

            <div
              className="
              flex items-center
              rounded-xl
              border border-white/20
              bg-white/10
              px-4
              transition
              focus-within:border-[#d4af37]
              "
            >
              <FaPhoneAlt className="text-[#d4af37]" />

              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                placeholder="+2519XXXXXXXX"
                className="
                w-full
                bg-transparent
                px-4
                py-4
                text-white
                outline-none
                placeholder:text-gray-400
                "
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Password
            </label>

            <div
              className="
              flex items-center
              rounded-xl
              border border-white/20
              bg-white/10
              px-4
              transition
              focus-within:border-[#d4af37]
              "
            >
              <FaLock className="text-[#d4af37]" />

              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                placeholder="Enter password"
                className="
                w-full
                bg-transparent
                px-4
                py-4
                text-white
                outline-none
                placeholder:text-gray-400
                "
              />
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="
              text-sm
              text-[#d4af37]
              hover:underline
              "
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-[#d4af37]
            py-4
            text-lg
            font-semibold
            text-white
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-[#b88b21]
            disabled:opacity-50
            hover:shadow-[0_15px_35px_rgba(212,175,55,.35)]
            "
          >
            <FaSignInAlt />

            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          className="
          mt-8
          text-center
          text-gray-300
          "
        >
          Don't have an account?
          <Link
            to="/signup"
            className="
            ml-2
            font-semibold
            text-[#d4af37]
            hover:underline
            "
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
