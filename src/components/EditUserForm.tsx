// src/components/EditUserForm.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";

interface EditUserFormProps {
  userToEdit?: any;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userToEdit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User"); // Default to User for creation
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // UseEffect to pre-fill the form with user data when editing
  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || ""); // fallback to empty string
      setEmail(userToEdit.email || ""); // fallback to empty string
      setRole(userToEdit.role || "User"); // fallback to default role
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update an existing user
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/update`,
        {
          uuid: userToEdit.uuid,
          name,
          email,
          role,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert("User info successfully updated.");
      localStorage.removeItem("userToEdit");
      navigate("/users");
    } catch (error) {
      alert("Failed to save user.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Edit User
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
        Update User
      </Button>
    </Box>
  );
};

export default EditUserForm;
