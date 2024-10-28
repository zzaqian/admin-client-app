// src/pages/UserDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

const UserDetails: React.FC = () => {
  const { userRole, loading } = useAuth(["Admin", "User"]);
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [showLockModal, setShowLockModal] = useState(false); // Modal visibility
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async (loading: boolean) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${id}`,
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
  }, [id, token, navigate, loading]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Typography>Loading user details...</Typography>;
  }

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
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

  const handleLockClick = (user: any) => {
    setShowLockModal(true); // Show the lock modal
  };

  const handleLockUser = async (reason: string) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/lock`,
        {
          id: user.id,
          lock_reason: reason,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchUserDetails();
    } catch (error) {
      alert("Failed to lock user.");
    }
  };

  const handleUnlockUser = async (id: number) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/unlock`,
        {
          id,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchUserDetails();
    } catch (error) {
      alert("Failed to unlock user.");
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
            <Button variant="contained" color="warning">
              Reset Password
            </Button>
            {user.status === "Locked" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUnlockUser(user.id)}
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
