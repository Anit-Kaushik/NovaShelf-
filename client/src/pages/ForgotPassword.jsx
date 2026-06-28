import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      await API.post("/users/forgot-password", {
        email: email.trim(),
      });

      toast.success("Password reset link sent to your email");
      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send password reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1C93B] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/35 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl px-8 pt-6 pb-8">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1
            className="text-5xl font-black text-[#1A5D1A]"
            style={{ fontFamily: "'Ibarra Real Nova', serif" }}
          >
            NovaShelf
          </h1>

          <h2 className="text-3xl font-bold text-[#1A5D1A] mt-4">
            Forgot Password
          </h2>

          <p className="text-[#1A5D1A] mt-2 font-medium">
            Enter your registered email address
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-black mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-[#1A5D1A] placeholder:text-black outline-none focus:ring-2 focus:ring-[#1A5D1A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-lg transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1A5D1A] hover:bg-[#50e306] text-[#F1C93B]"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;