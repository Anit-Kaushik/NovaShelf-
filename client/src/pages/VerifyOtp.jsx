import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      await API.post("/users/verify-email", {
        email,
        otp,
      });
     

      toast.success("Account verified");

      navigate("/login");
    } catch (error) {
         
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-[#F1C93B] via-[#FFE15D] to-[#FFD93D] flex items-center justify-center px-4">

    {/* OTP Card */}
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-yellow-200">

      {/* Heading */}
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
          Enter OTP sent to
        </p>

        <p className="text-[#1A5D1A] font-bold break-all mt-1">
          {email}
        </p>

      </div>

      {/* Form */}
      <form onSubmit={handleVerify} className="space-y-6">

        {/* OTP Input */}
        <div>

          <label className="block text-gray-700 mb-2 font-semibold">
            OTP
          </label>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-yellow-300 bg-yellow-50 outline-none focus:ring-2 focus:ring-[#1A5D1A] focus:border-[#1A5D1A] placeholder:text-gray-400 text-center tracking-[6px] text-lg font-bold"
          />

        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full bg-[#1A5D1A] hover:bg-[#2E7D32] transition duration-300 text-[#F1C93B] py-3 rounded-2xl font-bold text-lg"
        >
          Verify OTP
        </button>

      </form>

    </div>

  </div>
);
};

export default VerifyOtp;