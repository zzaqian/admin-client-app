// src/pages/EditUser.tsx
import React from "react";
import EditUserForm from "../components/EditUserForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Container, Button, Box, Typography } from "@mui/material";
import Loading from "../components/Loading";
import LogoutButton from "../components/LogoutButton";

const EditUser: React.FC = () => {
  const { loading } = useAuth(["Admin"]);
  const userToEdit = JSON.parse(localStorage.getItem("userToEdit") as string); // Parse the JSON string back into an object
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  const handleExit = () => {
    localStorage.removeItem("userToEdit");
    navigate("/users");
  };

  return (
    <Container maxWidth="sm">
      <LogoutButton />
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Edit User
        </Typography>
        <EditUserForm userToEdit={userToEdit} />
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleExit}
        >
          Back to User Management Page
        </Button>
      </Box>
    </Container>
  );
};

export default EditUser;
