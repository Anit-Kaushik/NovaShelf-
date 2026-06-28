import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);

      toast.success(`Welcome ${res.data.user.name}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1C93B] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl shadow-2xl p-8 bg-white/35 backdrop-blur-xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#1A5D1A] mb-5">
            EduNest
          </h2>

          <p className="text-[#1A5D1A] font-semibold mt-2 text-left text-3xl">
            Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-2 text-black font-semibold">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#1A5D1A] rounded-xl placeholder:text-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#1A5D1A]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-black font-semibold">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#1A5D1A] rounded-xl placeholder:text-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#1A5D1A]"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-[#1A5D1A] font-bold cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-2xl transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#1A5D1A] hover:bg-[#50e306] text-[#F1C93B]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-black font-semibold mt-6">
          Don't have an account?{" "}
          <span
            className="text-[#1A5D1A] font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;