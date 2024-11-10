// src/pages/UserDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import LogoutButton from "../components/LogoutButton";
import LockModal from "../components/LockModal";
import ResetPasswordModal from "../components/ResetPasswordModal";

const UserDetails: React.FC = () => {
  const { userRole, loading } = useAuth(["Admin", "User"]);
  const { uuid } = useParams<{ uuid: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [showLockModal, setShowLockModal] = useState(false); // Modal visibility
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false); // Reset Password Modal visibility
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async (loading: boolean) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${uuid}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setUser(response.data);
      } catch (error) {
        if (!loading) {
          alert("Failed to fetch user details.");
          navigate("/users");
        }
      }
    };

    if (!loading) {
      fetchUserDetails(loading);
    }
  }, [uuid, token, navigate, loading]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Typography>Loading user details...</Typography>;
  }

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${uuid}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      alert("Failed to fetch user details.");
      navigate("/users");
    }
  };

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

  const handleLockClick = (user: any) => {
    setShowLockModal(true); // Show the lock modal
  };

  const handleLockUser = async (reason: string) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/lock`,
        {
          uuid: user.uuid,
          lock_reason: reason,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchUserDetails();
    } catch (error) {
      handleResponseError(error);
    }
  };

  const handleUnlockUser = async (uuid: number) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/unlock`,
        {
          uuid,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchUserDetails();
    } catch (error) {
      handleResponseError(error);
    }
  };

  const handleResetPasswordClick = (user: any) => {
    setShowResetPasswordModal(true); // Show reset password modal
  };

  const handleResetPassword = async (reason: string) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/reset-password-email`,
        {
          uuid: user.uuid,
          email: user.email,
          reset_reason: reason,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(`Password reset email sent to ${user.email}.`);
    } catch (error) {
      handleResponseError(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <LogoutButton />
      {/* Lock Modal for locking a user */}
      {showLockModal && (
        <LockModal
          open={showLockModal}
          onClose={() => setShowLockModal(false)}
          onLock={handleLockUser}
        />
      )}
      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <ResetPasswordModal
          open={showResetPasswordModal}
          onClose={() => setShowResetPasswordModal(false)}
          onResetPassword={handleResetPassword}
        />
      )}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Name:</strong> {user.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Role:</strong> {user.role}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Account Status:</strong> {user.status}
        </Typography>
        {user.status === "Locked" && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Locked Reason:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.lock_reason}
            </Typography>
          </Box>
        )}

        {userRole === "Admin" && (
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleResetPasswordClick(user)}
            >
              Reset Password
            </Button>
            {user.status === "Locked" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUnlockUser(user.uuid)}
              >
                Unlock
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleLockClick(user)}
              >
                Lock
              </Button>
            )}
          </Box>
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/users")}
          sx={{ mt: 3 }}
        >
          Back to User Management Page
        </Button>
      </Paper>
    </Container>
  );
};

export default UserDetails;
