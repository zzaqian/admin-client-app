// src/pages/ResetPasswordForm.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Box, Container, Typography, TextField, Button } from "@mui/material";

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleResponseError = (error: any) => {
    if (axios.isAxiosError(error)) {
      // Type assertion to narrow the type
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Axios Error:", axiosError.response);
      alert(axiosError.response?.data.message || "An error occurred");
    } else {
      console.error("Unknown Error:", error);
      alert("Unknown Error");
    }
  };

  const handleResetPassword = async () => {
    if (!token) {
      alert("Invalid or expired password reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/reset-password-confirm`,
        {
          newPassword,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert("Password has been reset successfully.");
      navigate("/"); // Redirect to login page after successful reset
    } catch (error) {
        handleResponseError(error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box textAlign="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Please enter your new password below.
        </Typography>
      </Box>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Box mt={3} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;
