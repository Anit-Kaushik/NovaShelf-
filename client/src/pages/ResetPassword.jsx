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
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;