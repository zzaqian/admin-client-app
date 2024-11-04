// src/pages/UserManagement.tsx
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import Loading from "../components/Loading";
import LogoutButton from "../components/LogoutButton";
import LockModal from "../components/LockModal";
import ResetPasswordModal from "../components/ResetPasswordModal";

const UserManagement: React.FC = () => {
  const { userRole, loading } = useAuth(["Admin", "User"]);
  const [users, setUsers] = useState<any[]>([]);
  const [userToLock, setUserToLock] = useState<any | null>(null); // Track user to lock
  const [showLockModal, setShowLockModal] = useState(false); // Modal visibility
  const [userToReset, setUserToReset] = useState<any | null>(null); // Track user for reset password
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false); // Reset Password Modal visibility
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async (loading: boolean) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        if (!loading) {
          alert("Failed to fetch users.");
        }
      }
    };
    if (!loading) {
      fetchUsers(loading); // Call fetchUsers only when loading is finished
    }
  }, [loading, token]); // Add dependencies to prevent unnecessary re-renders

  if (loading) {
    return <Loading />;
  }

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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      alert("Failed to fetch users.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/delete`, {
        headers: { Authorization: `${token}` },
        data: { id },
      });
      alert("User successfully deleted.");
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (user: any) => {
    const userToStore = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    localStorage.setItem("userToEdit", JSON.stringify(userToStore)); // Set the user for editing, which will pass to the EditUserForm
    navigate("/edit-user");
  };

  const handleLockClick = (user: any) => {
    setUserToLock(user); // Set the user to be locked
    setShowLockModal(true); // Show the lock modal
  };

  const handleLockUser = async (reason: string) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/lock`,
        {
          id: userToLock.id,
          lock_reason: reason,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchUsers(); // Refresh user list
    } catch (error) {
      handleResponseError(error);
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
      fetchUsers(); // Refresh user list
    } catch (error) {
      handleResponseError(error);
    }
  };

  const handleResetPasswordClick = (user: any) => {
    setUserToReset(user); // Set user to reset password
    setShowResetPasswordModal(true); // Show reset password modal
  };

  const handleResetPassword = async (reason: string) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/reset-password-email`,
        {
          userId: userToReset.id,
          userEmail: userToReset.email,
          reason,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(`Password reset email sent to ${userToReset.email}.`);
      //   fetchUsers(); // Refresh user list if needed
    } catch (error) {
      handleResponseError(error);
    }
  };

  return (
    <Container maxWidth="lg">
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
      <Box sx={{ marginTop: 8, marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          User Table
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Is Locked</TableCell>
                {userRole === "Admin" && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  {userRole === "Admin" && (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(user)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleResetPasswordClick(user)}
                        sx={{ mr: 1 }}
                      >
                        Reset Password
                      </Button>
                      {user.status === "Locked" ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleUnlockUser(user.id)}
                          sx={{ mr: 1 }}
                        >
                          Unlock
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleLockClick(user)}
                          sx={{ mr: 1 }}
                        >
                          Lock
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {userRole === "Admin" && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate("/create-user")}
          >
            Create New User
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default UserManagement;
