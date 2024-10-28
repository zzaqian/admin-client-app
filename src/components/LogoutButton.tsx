// src/components/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Button, Box } from "@mui/material";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      // Make a request to the backend to invalidate the current token
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, null, {
        headers: { Authorization: `${token}` },
      });

      // Remove the token from localStorage
      localStorage.removeItem("token");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Type assertion to narrow the type
        const axiosError = error as AxiosError<{ message: string }>;
        console.error("Axios Error:", axiosError.response);
        alert(axiosError.response?.data.message || "An error occurred");
      } else {
        console.error("Unknown Error:", error);
        alert("Unknown Error");
      }
    } finally {
      // Redirect to the login page
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 32,
        right: 32,
      }}
    >
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default LogoutButton;
