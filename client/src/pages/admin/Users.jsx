import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/users");

      setUsers(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE USER
  const handleDeleteUser = async (id) => {
    if (deletingId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await API.delete(`/users/${id}`);

      toast.success("User deleted successfully");

      // instant UI update
      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F766E] flex items-center justify-center">
        <p className="text-white text-xl font-semibold">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F766E] p-6">

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-5xl font-black text-[#CCFBF1]"
          style={{ fontFamily: "'Ibarra Real Nova', serif" }}
        >
          NovaShelf
        </h1>

        <h2 className="text-3xl font-bold text-white mt-3">
          All Users
        </h2>

        <p className="text-[#99F6E4] mt-2">
          Manage all registered users
        </p>
      </div>

      {/* Empty state */}
      {users.length === 0 ? (
        <div className="bg-[#CCFBF1] rounded-2xl p-6 text-center shadow-lg">
          <p className="text-[#134E4A] text-lg font-semibold">
            No users found
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {users.map((user) => (
            <div
              key={user._id}
              className="bg-[#CCFBF1] rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition"
            >

              <h3 className="text-2xl font-bold text-[#134E4A] mb-4">
                {user.name}
              </h3>

              <div className="space-y-2 mb-6">
                <p className="text-[#115E59]">
                  Email:{" "}
                  <span className="text-[#134E4A] break-all">
                    {user.email}
                  </span>
                </p>

                <p className="text-[#115E59]">
                  Role:{" "}
                  <span className="text-[#134E4A]">
                    {user.role}
                  </span>
                </p>
              </div>

              <button
                onClick={() =>
                  handleDeleteUser(user._id)
                }
                disabled={deletingId === user._id}
                className={`w-full py-2 rounded-xl font-semibold text-white transition ${
                  deletingId === user._id
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {deletingId === user._id
                  ? "Deleting..."
                  : "Delete User"}
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Users;