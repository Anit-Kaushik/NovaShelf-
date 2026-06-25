import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { token } = useParams();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Enter new password");
      return;
    }

    try {
      await API.put(`/users/reset-password/${token}`, {
        password,
      });

      toast.success("Password reset successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

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
          Reset Password
        </h2>

        <p className="text-gray-500 mt-2">
          Create a new secure password
        </p>

      </div>

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-6">

        {/* Password Input */}
        <div>

          <label className="block text-gray-700 mb-2 font-semibold">
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-orange-200 bg-orange-50 outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] placeholder:text-gray-400"
          />

        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#EA580C] hover:bg-[#C2410C] transition text-white py-3 rounded-2xl font-bold text-lg"
        >
          Reset Password
        </button>

      </form>

    </div>

  </div>
);
};

export default ResetPassword;