import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid password reset link");
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await API.put(`/users/reset-password/${token}`, {
        password,
      });

      toast.success("Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
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

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              New Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-orange-200 bg-orange-50 outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl font-bold text-lg transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#EA580C] hover:bg-[#C2410C] text-white"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ResetPassword;