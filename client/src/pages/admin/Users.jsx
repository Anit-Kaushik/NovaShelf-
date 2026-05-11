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
    <div>
      <h2>All Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div>

          {users.map((user) => (
            <div
              key={user._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px"
              }}
            >
              <h3>{user.name}</h3>

              <p>Email: {user.email}</p>

              <p>Role: {user.role}</p>

              <button
  onClick={() => handleDeleteUser(user._id)}
  style={{
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }}
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