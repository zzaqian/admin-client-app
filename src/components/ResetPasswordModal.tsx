// src/components/ResetPasswordModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onResetPassword: (reason: string) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onClose,
  onResetPassword,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onResetPassword(reason); // Pass the reason to the parent component
    setReason("");
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset User Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a reason for resetting this user’s password:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Reason"
          fullWidth
          multiline
          minRows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="secondary">
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModal;
