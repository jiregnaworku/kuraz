import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheck,
  FaUsers,
} from "react-icons/fa";

import { getUsers, deleteUser, blockUser } from "../../api/userApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete user.");
    }
  };

  const handleBlock = async (id) => {
    try {
      const response = await blockUser(id);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isBlocked: response.isBlocked,
              }
            : user,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update user.");
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
          <h1 className="text-3xl font-bold text-[#24312c]">User Management</h1>

          <p className="mt-1 text-gray-500">Manage all registered customers.</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#24312c] px-6 py-4 text-white">
          <FaUsers />

          <div>
            <p className="text-sm">Total Users</p>
            <h2 className="text-2xl font-bold">{users.length}</h2>
          </div>
        </div>
      </div>

      {/* Search */}

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search by name, phone or email..."
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
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Verified</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Joined</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500">
                  No users found.
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
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                        Blocked
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        Active
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
                        title="View"
                      >
                        <FaEye />
                      </button>

                      {/* Edit */}

                      <button
                        className="rounded-lg bg-yellow-100 p-2 text-yellow-700 transition hover:bg-yellow-200"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      {/* Block / Unblock */}

                      <button
                        onClick={() => handleBlock(user._id)}
                        className={`rounded-lg p-2 transition ${
                          user.isBlocked
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        }`}
                        title={user.isBlocked ? "Unblock User" : "Block User"}
                      >
                        {user.isBlocked ? <FaCheck /> : <FaBan />}
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                        title="Delete User"
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
    </div>
  );
}
