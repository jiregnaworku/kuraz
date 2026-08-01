import { Link, useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaLock, FaUserPlus, FaUser } from "react-icons/fa";
import { useState } from "react";
import API from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage(t("order.orderFailed"));
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/auth/signup", {
        fullName: formData.fullName,
        phone: formData.phone,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage(t("auth.createAccount"));

      setTimeout(() => {
        navigate("/signin");
      }, 1500);
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
          "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />

      <div
        className="
        absolute left-5 top-24
        h-44 w-44
        rounded-full
        bg-[#d4af37]/20
        blur-3xl
        animate-pulse
        "
      />

      <div
        className="
        absolute bottom-20 right-5
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
        shadow-[0_25px_90px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
        max-[480px]:p-5
        max-[480px]:rounded-[22px]
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
            {t("auth.signupTitle")}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-300">
            {t("auth.signupDesc")}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              {t("auth.fullName")}
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
              <FaUser className="text-[#d4af37]" />

              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                placeholder={t("auth.fullName")}
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

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              {t("auth.confirmPassword")}
            </label>

            <div
              className="
              flex items-center
              rounded-xl
              border border-white/20
              bg-white/10
              px-4
              "
            >
              <FaLock className="text-[#d4af37]" />

              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder={t("auth.confirmPassword")}
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
            "
          >
            <FaUserPlus />

            {loading ? t("auth.creating") : t("auth.createAccount")}
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
            to="/signin"
            className="
            ml-2
            font-semibold
            text-[#d4af37]
            hover:underline
            "
          >
            {t("auth.signIn")}
          </Link>
        </div>
      </div>
    </section>
  );
}
