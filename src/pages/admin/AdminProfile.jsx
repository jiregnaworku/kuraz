import { useEffect, useState, useCallback } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaSave,
  FaTimes,
  FaEdit,
  FaShieldAlt,
  FaUserShield,
  FaCalendarAlt,
  FaStore,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";

const API_URL = "https://kuraz-backend-sin2.onrender.com/api/users";
// const API_URL = "http://localhost:5000/api/users";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default function AdminProfile() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // ===============================
  // Fetch Admin Profile
  // ===============================

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/me`, getAuthHeader());
      const userData = response.data.user || response.data;
      setUser(userData);
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        bio: userData.bio || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(t("admin.failedToLoad") || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  // ===============================
  // Handle Input Change
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Update Profile
  // ===============================

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put(
        `${API_URL}/me`,
        formData,
        getAuthHeader(),
      );

      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      setEditing(false);
      toast.success(
        t("admin.profileUpdated") || "Profile updated successfully! 🎉",
      );

      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedUser }),
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
          t("admin.failedToSave") ||
          "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // Cancel Edit
  // ===============================

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
    });
  };

  // ===============================
  // Get Initials
  // ===============================

  const getInitials = (name) => {
    if (!name) return "A";
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6f8] to-[#e8e9ec] px-4 pt-28 pb-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#24312c]">
            {t("admin.adminProfile")}
          </h1>
          <p className="mt-1 text-gray-500">{t("admin.adminProfileDesc")}</p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Cover Image */}
          <div className="relative h-32 bg-gradient-to-r from-[#d4af37] to-[#b88f1d] sm:h-40">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#24312c] text-3xl font-bold text-[#d4af37] shadow-xl sm:h-32 sm:w-32 sm:text-4xl">
                  {getInitials(user?.fullName)}
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-[#d4af37] p-1.5 text-white shadow-lg transition hover:scale-110 hover:bg-[#b88f1d] sm:p-2">
                  <FaCamera className="text-xs sm:text-sm" />
                </button>
              </div>
            </div>

            {/* Admin Badge */}
            <div className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#d4af37] shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <FaUserShield className="text-[#d4af37]" />
                <span>{t("admin.administrator")}</span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mt-16 p-6 sm:p-8">
            {!editing ? (
              // View Mode
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#24312c]">
                      {user?.fullName || "Admin User"}
                    </h2>
                    <p className="text-gray-500">{user?.email}</p>
                    {user?.role && (
                      <span className="mt-2 inline-block rounded-full bg-[#d4af37]/10 px-3 py-1 text-xs font-medium text-[#d4af37]">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-2.5 font-medium text-white transition hover:bg-[#b88f1d] hover:shadow-lg"
                  >
                    <FaEdit />
                    {t("admin.editProfile")}
                  </button>
                </div>

                {/* Profile Details */}
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#d4af37]/10 p-2 text-[#d4af37]">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {t("admin.fullName")}
                        </p>
                        <p className="font-medium text-[#24312c]">
                          {user?.fullName || t("common.notSet") || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#d4af37]/10 p-2 text-[#d4af37]">
                        <FaEnvelope />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {t("admin.email")}
                        </p>
                        <p className="font-medium text-[#24312c]">
                          {user?.email || t("common.notSet") || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#d4af37]/10 p-2 text-[#d4af37]">
                        <FaPhone />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {t("admin.phone")}
                        </p>
                        <p className="font-medium text-[#24312c]">
                          {user?.phone || t("common.notSet") || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#d4af37]/10 p-2 text-[#d4af37]">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {t("admin.address")}
                        </p>
                        <p className="font-medium text-[#24312c]">
                          {user?.address || t("common.notSet") || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {user?.bio && (
                  <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <p className="text-xs text-gray-500">{t("admin.bio")}</p>
                    <p className="mt-1 text-[#24312c]">{user.bio}</p>
                  </div>
                )}

                {/* Account Info */}
                <div className="mt-8 rounded-xl bg-gradient-to-r from-[#24312c]/5 to-[#3a4a42]/5 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <FaUserShield className="text-[#d4af37]" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {t("admin.role")}
                        </p>
                        <p className="text-sm font-medium text-[#24312c]">
                          {user?.role || "Admin"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaStore className="text-[#d4af37]" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {t("admin.store") || "Store"}
                        </p>
                        <p className="text-sm font-medium text-[#24312c]">
                          Kuraz Design
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-[#d4af37]" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {t("admin.joined")}
                        </p>
                        <p className="text-sm font-medium text-[#24312c]">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleUpdate}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#24312c]">
                      {t("admin.editProfile")}
                    </h2>
                    <p className="text-gray-500">
                      {t("admin.editProfileDesc")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-2.5 font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaTimes />
                    {t("common.cancel")}
                  </button>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#24312c]">
                      {t("admin.fullName")} *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] outline-none transition focus:border-[#d4af37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#24312c]">
                      {t("admin.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] outline-none transition focus:border-[#d4af37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#24312c]">
                      {t("admin.phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09XXXXXXXX"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] outline-none transition focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#24312c]">
                      {t("admin.address")}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={
                        t("admin.addressPlaceholder") || "Your address"
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] outline-none transition focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-[#24312c]">
                    {t("admin.bio")}
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    placeholder={
                      t("admin.bioPlaceholder") || "Tell us about yourself..."
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] outline-none transition focus:border-[#d4af37]"
                  />
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 font-medium text-white transition hover:bg-[#b88f1d] hover:shadow-lg disabled:opacity-50"
                  >
                    <FaSave />
                    {saving
                      ? t("common.saving") || "Saving..."
                      : t("admin.saveChanges")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="border-b border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#24312c]">
              {t("admin.security")}
            </h3>
            <p className="text-sm text-gray-500">{t("admin.securityDesc")}</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-50 p-2 text-green-600">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="font-medium text-[#24312c]">
                    {t("admin.password")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("admin.lastChanged")}:{" "}
                    {user?.passwordChangedAt
                      ? new Date(user.passwordChangedAt).toLocaleDateString()
                      : t("admin.never")}
                  </p>
                </div>
              </div>
              <button className="rounded-xl bg-[#24312c] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#18201d]">
                {t("admin.changePassword")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
