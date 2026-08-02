import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave } from "react-icons/fa";

import { updateProfile, changePassword } from "../../api/profileApi";
import { useLanguage } from "../../context/LanguageContext";

export default function Settings() {
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profileData);
      setMessage(
        t("settings.profileUpdated") || "Profile updated successfully",
      );
      setMessageType("success");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage(t("settings.profileUpdateFailed") || "Profile update failed");
      setMessageType("error");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage(t("settings.passwordsDoNotMatch") || "Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage(
        t("settings.passwordChanged") || "Password changed successfully",
      );
      setMessageType("success");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage(
        t("settings.passwordChangeFailed") || "Password change failed",
      );
      setMessageType("error");
    }
  };

  return (
    <div
      className="
      rounded-[1.75rem]
      border
      border-white/70
      bg-white/90
      p-5
      shadow-[0_18px_50px_rgba(36,49,44,0.08)]
      "
    >
      <div
        className="
        mb-7
        border-b
        border-gray-100
        pb-4
        "
      >
        <h1
          className="
          text-xl
          font-bold
          text-[#24312c]
          "
        >
          {t("settings.title")}
        </h1>

        <p
          className="
          mt-1
          text-gray-500
          "
        >
          {t("settings.subtitle")}
        </p>
      </div>

      {message && (
        <p
          className={`mb-5 text-center font-semibold ${
            messageType === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* Profile Update */}

      <div className="mb-10">
        <h2
          className="
          mb-4
          text-lg
          font-bold
          text-[#24312c]
          "
        >
          {t("settings.personalInfo")}
        </h2>

        <Input
          icon={<FaUser />}
          label={t("settings.fullName")}
          name="fullName"
          value={profileData.fullName}
          onChange={handleProfileChange}
        />

        <Input
          icon={<FaEnvelope />}
          label={t("settings.email")}
          name="email"
          value={profileData.email}
          onChange={handleProfileChange}
        />

        <Input
          icon={<FaPhone />}
          label={t("settings.phone")}
          name="phone"
          value={profileData.phone}
          onChange={handleProfileChange}
        />

        <button
          onClick={handleUpdateProfile}
          className="
          mt-3
          flex
          w-full
          items-center
          justify-center
          gap-2.5
          rounded-2xl
          bg-[#d4af37]
          py-3.5
          font-semibold
          text-white
          hover:bg-[#b89025]
          "
        >
          <FaSave />
          {t("settings.saveProfile")}
        </button>
      </div>

      {/* Password Section */}

      <div>
        <h2
          className="
          mb-4
          text-lg
          font-bold
          text-[#24312c]
          "
        >
          {t("settings.changePassword")}
        </h2>

        <Input
          icon={<FaLock />}
          label={t("settings.currentPassword")}
          name="currentPassword"
          type="password"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
        />

        <Input
          icon={<FaLock />}
          label={t("settings.newPassword")}
          name="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />

        <Input
          icon={<FaLock />}
          label={t("settings.confirmPassword")}
          name="confirmPassword"
          type="password"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
        />

        <button
          onClick={handleChangePassword}
          className="
          mt-3
          flex
          w-full
          items-center
          justify-center
          gap-2.5
          rounded-2xl
          bg-[#24312c]
          py-3.5
          font-semibold
          text-white
          hover:bg-[#18221f]
          "
        >
          <FaLock />
          {t("settings.updatePassword")}
        </button>
      </div>
    </div>
  );
}

function Input({ icon, label, name, value, onChange, type = "text" }) {
  return (
    <div className="mb-5">
      <label
        className="
        mb-2
        block
        text-sm
        font-semibold
        text-[#24312c]
        "
      >
        {label}
      </label>

      <div
        className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-gray-200
        px-4
        py-1
        "
      >
        <span
          className="
          text-[#d4af37]
          "
        >
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="
          w-full
          py-3
          text-sm
          text-[#24312c]
          outline-none
          "
        />
      </div>
    </div>
  );
}
