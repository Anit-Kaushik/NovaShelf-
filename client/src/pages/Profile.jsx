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
  <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center px-4">

    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-orange-200">

      {/* Heading */}
      <div className="text-center mb-8">

        <h1
          className="text-5xl font-black text-[#EA580C]"
          style={{ fontFamily: "'Ibarra Real Nova', serif" }}
        >
          NovaShelf
        </h1>

        <h2 className="text-3xl font-bold text-gray-800 mt-4">
          User Profile
        </h2>

        <p className="text-gray-500 mt-2">
          Manage your account information
        </p>

      </div>

      {/* Profile Card */}
      <div className="space-y-5">

        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">

          <p className="text-gray-700">
            <span className="font-bold text-[#EA580C]">Name:</span>{" "}
            {user.name}
          </p>

        </div>

        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">

          <p className="text-gray-700 break-all">
            <span className="font-bold text-[#EA580C]">Email:</span>{" "}
            {user.email}
          </p>

        </div>

        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">

          <p className="text-gray-700">
            <span className="font-bold text-[#EA580C]">Role:</span>{" "}
            {user.role}
          </p>

        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#EA580C] hover:bg-[#C2410C] transition text-white py-3 rounded-2xl font-bold text-lg mt-4"
        >
          Logout
        </button>

      </div>

    </div>

  </div>
);
};

export default Profile;