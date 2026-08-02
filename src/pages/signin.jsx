import { Link, useNavigate } from "react-router-dom";
import {
  FaPhoneAlt,
  FaLock,
  FaSignInAlt,
  FaHome,
  FaArrowLeft,
} from "react-icons/fa";
import { useState } from "react";
import API from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export default function Signin() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

      setMessage(t("auth.signinTitle"));

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
      setMessage(error.response?.data?.message || t("order.orderFailed"));
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
        {/* Back to Home Button - Inside Card */}
        <Link
          to="/#home"
          className="
            absolute
            left-4
            top-4
            z-10
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/30
            bg-white/20
            px-3
            py-1.5
            text-xs
            font-medium
            text-white
            backdrop-blur-md
            transition-all
            duration-300
            hover:bg-white/30
            hover:scale-105
            hover:shadow-lg
            sm:left-5
            sm:top-5
            sm:px-4
            sm:py-2
            sm:text-sm
            md:left-6
            md:top-6
          "
        >
          <FaHome className="text-[#ffffff] transition-transform duration-300 group-hover:scale-110 text-xs sm:text-sm" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">
            <FaArrowLeft className="text-[#ffffff] text-xs" />
          </span>
        </Link>

        <div className="mb-8 text-center mt-4 sm:mt-2">
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
            {t("auth.signinTitle")}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-300">
            {t("auth.signinDesc")}
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
              {t("auth.phone")}
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
              {t("auth.password")}
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
                placeholder={t("auth.password")}
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
              {t("auth.forgot")}
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

            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>
        </form>

        <div
          className="
          mt-8
          text-center
          text-gray-300
          "
        >
          {t("auth.noAccount")}
          <Link
            to="/signup"
            className="
            ml-2
            font-semibold
            text-[#d4af37]
            hover:underline
            "
          >
            {t("auth.signupLink")}
          </Link>
        </div>
      </div>
    </section>
  );
}
