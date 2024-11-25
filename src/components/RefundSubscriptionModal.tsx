// src/components/RefundSubscriptionModal.tsx
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

interface RefundSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onRefund: (amount: string) => void;
}

const RefundSubscriptionModal: React.FC<RefundSubscriptionModalProps> = ({
  open,
  onClose,
  onRefund,
}) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    onRefund(amount); // Pass the amount to the parent component
    setAmount("");
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel Subscription</DialogTitle>
      <DialogContent>
        <DialogContentText>Please enter a refund amount:</DialogContentText>
        <TextField
          label="Refund Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          slotProps={{
            input: {},
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="secondary"
          disabled={!amount || Number(amount) <= 0}
        >
          Refund Subscription
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefundSubscriptionModal;
