// src/pages/CreateUser.tsx
import React from "react";
import CreateUserForm from "../components/CreateUserForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Container, Button, Box, Typography } from "@mui/material";
import Loading from "../components/Loading";
import LogoutButton from "../components/LogoutButton";

const CreateUser: React.FC = () => {
  const { loading } = useAuth(["Admin"]);
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

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
          Create User
        </Typography>
        <CreateUserForm />
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={() => navigate("/users")}
        >
          Back to User Management Page
        </Button>
      </Box>
    </Container>
  );
};

export default CreateUser;
