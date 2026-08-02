import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheck,
  FaUsers,
  FaUserSlash,
  FaUserCheck,
} from "react-icons/fa";

import { getUsers, deleteUser, blockUser } from "../../api/userApi";
import ConfirmModal from "../../components/profile/ConfirmModal";
import { useLanguage } from "../../context/LanguageContext";

export default function Users() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [, setActionType] = useState(""); // 'delete' or 'block'

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setActionType("delete");
    setShowDeleteModal(true);
  };

  // Open block/unblock confirmation modal
  const openBlockModal = (user) => {
    setSelectedUser(user);
    setActionType("block");
    setShowBlockModal(true);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser._id);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
      alert(t("admin.failedToDelete") || "Failed to delete user.");
    }
  };

  // Handle block/unblock confirmation
  const handleBlock = async () => {
    if (!selectedUser) return;

    try {
      const response = await blockUser(selectedUser._id);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUser._id
            ? {
                ...user,
                isBlocked: response.isBlocked,
              }
            : user,
        ),
      );
      setShowBlockModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
      alert(t("admin.failedToUpdate") || "Failed to update user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.fullName || "";
    const email = user.email || "";
    const phone = user.phone || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#24312c]">
            {t("admin.userManagement")}
          </h1>

          <p className="mt-1 text-gray-500">{t("admin.userManagementDesc")}</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#24312c] px-6 py-4 text-white">
          <FaUsers />

          <div>
            <p className="text-sm">{t("admin.totalUsers")}</p>
            <h2 className="text-2xl font-bold">{users.length}</h2>
          </div>
        </div>
      </div>

      {/* Search */}

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          placeholder={t("admin.searchUsers")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:border-[#d4af37]"
        />
      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-[#24312c] text-white">
            <tr>
              <th className="px-6 py-4 text-left">{t("admin.userName")}</th>
              <th className="px-6 py-4 text-left">{t("admin.userPhone")}</th>
              <th className="px-6 py-4 text-left">{t("admin.userEmail")}</th>
              <th className="px-6 py-4 text-left">{t("admin.role")}</th>
              <th className="px-6 py-4 text-left">{t("admin.verified")}</th>
              <th className="px-6 py-4 text-left">{t("admin.userStatus")}</th>
              <th className="px-6 py-4 text-left">{t("admin.joined")}</th>
              <th className="px-6 py-4 text-center">
                {t("admin.userActions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500">
                  {t("admin.noUsers")}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {user.fullName || "N/A"}
                  </td>

                  <td className="px-6 py-4">{user.phone}</td>

                  <td className="px-6 py-4">{user.email || "N/A"}</td>

                  <td className="px-6 py-4 capitalize">{user.role}</td>

                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {t("admin.verifiedStatus")}
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                        {t("admin.pendingStatus")}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                        {t("admin.blocked")}
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {t("admin.active")}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      {/* View */}

                      <button
                        className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                        title={t("admin.view")}
                      >
                        <FaEye />
                      </button>

                      {/* Edit */}

                      <button
                        className="rounded-lg bg-yellow-100 p-2 text-yellow-700 transition hover:bg-yellow-200"
                        title={t("admin.edit")}
                      >
                        <FaEdit />
                      </button>

                      {/* Block / Unblock */}

                      <button
                        onClick={() => openBlockModal(user)}
                        className={`rounded-lg p-2 transition ${
                          user.isBlocked
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        }`}
                        title={
                          user.isBlocked ? t("admin.unblock") : t("admin.block")
                        }
                      >
                        {user.isBlocked ? <FaCheck /> : <FaBan />}
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() => openDeleteModal(user)}
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                        title={t("admin.delete")}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title={t("admin.deleteUser")}
        message={t("admin.deleteUserConfirm", {
          userName:
            selectedUser?.fullName ||
            selectedUser?.phone ||
            t("admin.thisUser"),
        })}
        confirmText={t("admin.delete")}
        cancelText={t("common.cancel")}
        type="danger"
        icon={<FaTrash className="text-3xl text-red-600" />}
      />

      {/* Block/Unblock Confirmation Modal */}
      <ConfirmModal
        isOpen={showBlockModal}
        onConfirm={handleBlock}
        onCancel={() => {
          setShowBlockModal(false);
          setSelectedUser(null);
        }}
        title={
          selectedUser?.isBlocked
            ? t("admin.unblockUser")
            : t("admin.blockUser")
        }
        message={
          selectedUser?.isBlocked
            ? t("admin.unblockUserConfirm", {
                userName:
                  selectedUser?.fullName ||
                  selectedUser?.phone ||
                  t("admin.thisUser"),
              })
            : t("admin.blockUserConfirm", {
                userName:
                  selectedUser?.fullName ||
                  selectedUser?.phone ||
                  t("admin.thisUser"),
              })
        }
        confirmText={
          selectedUser?.isBlocked ? t("admin.unblock") : t("admin.block")
        }
        cancelText={t("common.cancel")}
        type={selectedUser?.isBlocked ? "info" : "danger"}
        icon={
          selectedUser?.isBlocked ? (
            <FaUserCheck className="text-3xl text-green-600" />
          ) : (
            <FaUserSlash className="text-3xl text-red-600" />
          )
        }
      />
    </div>
  );
}
