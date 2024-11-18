// src/pages/SubscriptionManagement.tsx
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import Loading from "../components/Loading";
import LogoutButton from "../components/LogoutButton";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal";
import UpdatePlanModal from "../components/UpdatePlanModal";

const SubscriptionManagement: React.FC = () => {
  const { userRole, loading } = useAuth(["Admin", "User"]);
  const [subs, setSubs] = useState<any[]>([]);
  const [subToCancel, setSubToCancel] = useState<any | null>(null); // Track subscription to cancel
  const [showCancelSubModal, setshowCancelSubModal] = useState(false); // Modal visibility
  const [subToUpdatePlan, setSubToUpdatePlan] = useState<any | null>(null); // Track subscription to update plan
  const [showUpdatePlanModal, setshowUpdatePlanModal] = useState(false); // Modal visibility
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubs = async (loading: boolean) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/subscriptions`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setSubs(response.data);
      } catch (error) {
        if (!loading) {
          alert("Failed to fetch subscriptions.");
        }
      }
    };
    if (!loading) {
      fetchSubs(loading); // Call fetchSubs only when loading is finished
    }
  }, [loading, token]); // Add dependencies to prevent unnecessary re-renders

  if (loading) {
    return <Loading />;
  }

  const handleResponseError = (error: any) => {
    if (axios.isAxiosError(error)) {
      // Type assertion to narrow the type
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Axios Error:", axiosError.response);
      alert(axiosError.response?.data.message || "An error occurred");
    } else {
      console.error("Unknown Error:", error);
      alert("Unknown Error");
    }
  };

  const fetchSubs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/subscriptions`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      setSubs(response.data);
    } catch (error) {
      alert("Failed to fetch subscriptions.");
    }
  };

  const handleCancelClick = (sub: any) => {
    setSubToCancel(sub); // Set the user to be locked
    setshowCancelSubModal(true); // Show the lock modal
  };

  const handleCancel = async (reason: string) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/subscriptions/cancel`,
        {
          uuid: subToCancel.uuid,
          cancel_reason: reason,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchSubs(); // Refresh subscription list
    } catch (error) {
      handleResponseError(error);
    }
  };

  const handleUpdatePlanClick = (sub: any) => {
    setSubToUpdatePlan(sub); // Set the user to be locked
    setshowUpdatePlanModal(true); // Show the lock modal
  };

  const handleUpdatePlan = async (newPlan: string) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/subscriptions/update-plan`,
        {
          uuid: subToUpdatePlan.uuid,
          new_plan: newPlan,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchSubs(); // Refresh subscription list
    } catch (error) {
      handleResponseError(error);
    }
  };

  return (
    <Container maxWidth="lg">
      <LogoutButton />
      {/* Cancel Sub Modal for cancelling a subscription */}
      {showCancelSubModal && (
        <CancelSubscriptionModal
          open={showCancelSubModal}
          onClose={() => setshowCancelSubModal(false)}
          onCancel={handleCancel}
        />
      )}
      {/* Update Plan Modal for updating a sub plan*/}
      {showUpdatePlanModal && (
        <UpdatePlanModal
          open={showUpdatePlanModal}
          oldPlan={subToUpdatePlan.plan}
          onClose={() => setshowUpdatePlanModal(false)}
          onUpdatePlan={handleUpdatePlan}
        />
      )}
      <Box sx={{ marginTop: 8, marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subscription Management
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Subscription Table
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Plan</TableCell>
                {userRole === "Admin" && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {subs.map((sub) => (
                <TableRow key={sub.uuid}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => navigate(`/subscriptions/${sub.uuid}`)}
                    >
                      {sub.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{sub.status}</TableCell>
                  <TableCell>{sub.plan}</TableCell>
                  {userRole === "Admin" && (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleUpdatePlanClick(sub)}
                        sx={{ mr: 1 }}
                      >
                        Update Plan
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleCancelClick(sub)}
                        sx={{ mr: 1 }}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default SubscriptionManagement;
