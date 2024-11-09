// src/pages/ResetPassword.tsx
import React from "react";
import ResetPasswordForm from "../components/ResetPasswordForm"
import {
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";

const ResetPassword: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reset Password
          </Typography>
        </Box>
        <ResetPasswordForm />
      </Paper>
    </Container>
  );
};

export default ResetPassword;
