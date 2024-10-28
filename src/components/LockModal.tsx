// src/components/LockModal.tsx
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

interface LockModalProps {
  open: boolean;
  onClose: () => void;
  onLock: (reason: string) => void;
}

const LockModal: React.FC<LockModalProps> = ({ open, onClose, onLock }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onLock(reason); // Pass the reason to the parent component
    setReason("");
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Lock User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a reason for locking this user:
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
          Lock User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LockModal;
