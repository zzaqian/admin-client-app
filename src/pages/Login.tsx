// src/pages/Login.tsx
import React from "react";
import { Container, Box, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";

const Login: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default Login;
