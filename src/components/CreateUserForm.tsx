// src/components/CreateUserForm.tsx
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";

const CreateUserForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default to User for creation
  const token = localStorage.getItem("token");

  const handleResponseError = (error: any) => {
    if (axios.isAxiosError(error)) {
      // Type assertion to narrow the type
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Axios Error:", axiosError.response);
      alert(axiosError.response?.data.message || "Failed to save user");
    } else {
      console.error("Unknown Error:", error);
      alert("Unknown Error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a new user
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/create`,
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert("User successfully created.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("User");
    } catch (error) {
      handleResponseError(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Create New User
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        select
        fullWidth
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="User">User</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
      </TextField>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
      >
        Create New User
      </Button>
    </Box>
  );
};

export default CreateUserForm;
