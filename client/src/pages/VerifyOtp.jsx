import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Prevent direct access without email
  useEffect(() => {
    if (!email) {
      toast.error("Please register first.");
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!otp.trim()) {
      toast.error("Enter OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be exactly 6 digits");
      return;
    }

    setLoading(true);

    try {
      await API.post("/users/verify-email", {
        email,
        otp,
      });

      toast.success("Account verified successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1C93B] via-[#FFE15D] to-[#FFD93D] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-yellow-200">

        <div className="text-center mb-8">
          <h1
            className="text-5xl font-black text-[#1A5D1A]"
            style={{ fontFamily: "'Ibarra Real Nova', serif" }}
          >
            NovaShelf
          </h1>

          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Verify OTP
          </h2>

          <p className="text-gray-500 mt-3">
            Enter the OTP sent to
          </p>

          <p className="text-[#1A5D1A] font-bold break-all mt-1">
            {email}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              maxLength={6}
              placeholder="Enter OTP"
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              className="w-full px-4 py-3 rounded-2xl border border-yellow-300 bg-yellow-50 outline-none focus:ring-2 focus:ring-[#1A5D1A] text-center tracking-[6px] text-lg font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl font-bold text-lg transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1A5D1A] hover:bg-[#2E7D32] text-[#F1C93B]"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default VerifyOtp;