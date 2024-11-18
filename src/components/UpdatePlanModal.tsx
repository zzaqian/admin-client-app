// src/components/UpdatePlanModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface UpdatePlanModalProps {
  open: boolean;
  oldPlan: string;
  onClose: () => void;
  onUpdatePlan: (newPlan: string) => void;
}

const UpdatePlanModal: React.FC<UpdatePlanModalProps> = ({
  open,
  oldPlan,
  onClose,
  onUpdatePlan,
}) => {
  const [newPlan, setNewPlan] = useState(oldPlan);

  const handleSubmit = () => {
    onUpdatePlan(newPlan); // Pass the newPlan to the parent component
    setNewPlan("");
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel Subscription</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please choose a new plan for the subscription:
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel id="plan-select-label">Plan</InputLabel>
          <Select
            labelId="plan-select-label"
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
            fullWidth
          >
            <MenuItem value="Free">Free</MenuItem>
            <MenuItem value="Silver">Silver</MenuItem>
            <MenuItem value="Gold">Gold</MenuItem>
            <MenuItem value="Platinum">Platinum</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="secondary">
          Update Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePlanModal;
