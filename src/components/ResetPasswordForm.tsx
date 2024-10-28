// src/components/ResetPasswordForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/reset-password`,
        {
          email,
          password: newPassword,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert("Password reset successfully");
      setEmail("");
      setNewPassword("");
    } catch (error) {
      alert("Failed to reset password.");
    }
    navigate("/users");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Reset User Password</h3>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPasswordForm;
