import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH USERS
  const fetchUsers = async () => {
    try {

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

  const handleDeleteUser = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this user?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(`/users/${id}`);

    toast.success("User deleted");

    // remove from UI instantly
    setUsers((prev) =>
      prev.filter((user) => user._id !== id)
    );

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Delete failed"
    );

  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <h3>Loading users...</h3>;
  }

 return (
  <div className="min-h-screen bg-[#0F766E] p-6">

    {/* Heading */}
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

    {/* No Users */}
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
            className="bg-[#CCFBF1] rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition duration-300"
          >

            {/* User Name */}
            <h3 className="text-2xl font-bold text-[#134E4A] mb-4">
              {user.name}
            </h3>

            {/* Details */}
            <div className="space-y-2 mb-6">

              <p className="text-[#115E59] font-medium">
                Email:{" "}
                <span className="font-normal text-[#134E4A] break-all">
                  {user.email}
                </span>
              </p>

              <p className="text-[#115E59] font-medium">
                Role:{" "}
                <span className="font-normal text-[#134E4A]">
                  {user.role}
                </span>
              </p>

            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteUser(user._id)}
              className="w-full bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-xl font-semibold"
            >
              Delete User
            </button>

          </div>

        ))}

      </div>

    )}

  </div>
);
};

export default Users;