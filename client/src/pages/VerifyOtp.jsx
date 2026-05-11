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
  <div className="min-h-screen bg-[#F1C93B] flex items-center justify-center px-4 overflow-hidden relative">

    {/* OTP Card */}
    <div className="relative z-10 w-full max-w-md bg-white/35 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl px-8 pt-6 pb-8">

      {/* Heading */}
      <div className="mb-8 text-center">

        <h1
          className="text-5xl font-black text-[#1A5D1A]"
          style={{ fontFamily: "'Ibarra Real Nova', serif" }}
        >
          NovaShelf
        </h1>

        <h2 className="text-3xl font-bold text-[#1A5D1A] mt-4">
          Verify OTP
        </h2>

        <p className="text-[#1A5D1A] mt-2 font-medium">
          Enter OTP sent to:
        </p>

        <p className="text-[#1A5D1A] font-bold break-all">
          {email}
        </p>

      </div>

      {/* Form */}
      <form onSubmit={handleVerify} className="space-y-5">

        <div>
          <label className="block text-black mb-2 font-medium">
            OTP
          </label>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-[#1A5D1A] placeholder:text-black outline-none focus:ring-2 focus:ring-[#1A5D1A]"
          />
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full bg-[#1A5D1A] hover:bg-[#50e306] transition duration-300 text-[#F1C93B] py-3 rounded-xl font-bold text-lg"
        >
          Verify
        </button>

      </form>

    </div>
  </div>
);
};

export default VerifyOtp;