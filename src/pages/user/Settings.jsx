import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave } from "react-icons/fa";

import { updateProfile, changePassword } from "../../api/profileApi";

export default function Settings() {
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

      setMessage("Profile updated successfully");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Profile update failed");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match");

      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,

        newPassword: passwordData.newPassword,
      });

      setMessage("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Password change failed");
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
          Account Settings
        </h1>

        <p
          className="
          mt-1
          text-gray-500
          "
        >
          Manage your personal information and security.
        </p>
      </div>

      {message && (
        <p
          className="
          mb-5
          text-center
          font-semibold
          text-[#d4af37]
          "
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
          Personal Information
        </h2>

        <Input
          icon={<FaUser />}
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleProfileChange}
        />

        <Input
          icon={<FaEnvelope />}
          label="Email"
          name="email"
          value={profileData.email}
          onChange={handleProfileChange}
        />

        <Input
          icon={<FaPhone />}
          label="Phone"
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
          Save Profile
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
          Change Password
        </h2>

        <Input
          icon={<FaLock />}
          label="Current Password"
          name="currentPassword"
          type="password"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
        />

        <Input
          icon={<FaLock />}
          label="New Password"
          name="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />

        <Input
          icon={<FaLock />}
          label="Confirm New Password"
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
          Update Password
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
