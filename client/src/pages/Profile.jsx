import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <h3>No user logged in</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Profile</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "10px",
          width: "300px"
        }}
      >
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <button onClick={handleLogout} style={{ marginTop: "10px" }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;