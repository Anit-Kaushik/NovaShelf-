import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await API.post("/users/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      toast.success("OTP sent successfully to your email");

      navigate("/verify-otp", {
        state: { email: email.trim() },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1C93B] flex items-center justify-center px-4 overflow-hidden relative">
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
            Create Account
          </h2>

          <p className="text-[#1A5D1A] mt-2 font-medium">
            Join your digital library
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-black mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f1c93b] border border-[#1A5D1A] placeholder:text-black outline-none focus:ring-2 focus:ring-[#1A5D1A]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-black mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f1c93b] border border-[#1A5D1A] placeholder:text-black outline-none focus:ring-2 focus:ring-[#1A5D1A]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-black mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f1c93b] border border-[#1A5D1A] placeholder:text-black outline-none focus:ring-2 focus:ring-[#1A5D1A]"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-lg transition duration-300 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1A5D1A] hover:bg-[#50e306] text-[#F1C93B]"
            }`}
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center text-black mt-6">
          Already have an account?{" "}
          <span
            className="text-[#1A5D1A] font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;