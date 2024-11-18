// src/components/CancelSubscriptionModal.tsx
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

interface CancelSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onCancel: (reason: string) => void;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({ open, onClose, onCancel }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onCancel(reason); // Pass the reason to the parent component
    setReason("");
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel Subscription</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a reason for cancellation:
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
          Go Back
        </Button>
        <Button onClick={handleSubmit} color="secondary">
          Cancel Subscription
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelSubscriptionModal;
