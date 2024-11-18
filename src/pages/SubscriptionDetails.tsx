// src/pages/SubscriptionDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import LogoutButton from "../components/LogoutButton";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal";
import UpdatePlanModal from "../components/UpdatePlanModal";

const SubscriptionDetails: React.FC = () => {
  const { userRole, loading } = useAuth(["Admin", "User"]);
  const { uuid } = useParams<{ uuid: string }>();
  const [sub, setSub] = useState<any | null>(null);
  const [showCancelSubModal, setshowCancelSubModal] = useState(false); // Modal visibility
  const [showUpdatePlanModal, setshowUpdatePlanModal] = useState(false); // Modal visibility
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionDetails = async (loading: boolean) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/subscriptions/${uuid}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setSub(response.data);
      } catch (error) {
        if (!loading) {
          alert("Failed to fetch subscription details.");
          navigate("/subscriptions");
        }
      }
    };

    if (!loading) {
      fetchSubscriptionDetails(loading);
    }
  }, [uuid, token, navigate, loading]);

  if (loading) {
    return <Loading />;
  }

  if (!sub) {
    return <Typography>Loading subscription details...</Typography>;
  }

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/subscriptions/${uuid}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      setSub(response.data);
    } catch (error) {
      alert("Failed to fetch subscription details.");
      navigate("/subscriptions");
    }
  };

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

  const handleCancelClick = () => {
    setshowCancelSubModal(true); // Show the lock modal
  };

  const handleCancel = async (reason: string) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/subscriptions/cancel`,
        {
          uuid: uuid,
          cancel_reason: reason,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchSubscriptionDetails();
    } catch (error) {
      handleResponseError(error);
    }
  };

  const handleUpdatePlanClick = () => {
    setshowUpdatePlanModal(true); // Show the lock modal
  };

  const handleUpdatePlan = async (newPlan: string) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/subscriptions/update-plan`,
        {
          uuid: uuid,
          new_plan: newPlan,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert(response.data.message);
      fetchSubscriptionDetails(); // Refresh subscription
    } catch (error) {
      handleResponseError(error);
    }
  };

  const parseDatetime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Container maxWidth="sm">
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
          oldPlan={sub.plan}
          onClose={() => setshowUpdatePlanModal(false)}
          onUpdatePlan={handleUpdatePlan}
        />
      )}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subscription Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Name:</strong> {sub.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Status:</strong> {sub.status}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Plan:</strong> {sub.plan}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Billing Cycle:</strong> { (sub.billing_cycle === 'Free') ? "N/A" : sub.billing_cycle}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Expiration Date:</strong> {sub.expiration_date ? parseDatetime(sub.expiration_date) : "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Renewal Date:</strong> {sub.renewal_date ? parseDatetime(sub.renewal_date) : "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Last Paid:</strong> {sub.cycle_amount}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Discount Code:</strong> {sub.discount_code || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Canceled?:</strong>{" "}
          {sub.is_canceled ? "Canceled" : "Not Canceled"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Details:</strong> {sub.details || "N/A"}
        </Typography>

        {userRole === "Admin" && (
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleUpdatePlanClick()}
              sx={{ mr: 1 }}
            >
              Update Plan
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleCancelClick()}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
          </Box>
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/subscriptions")}
          sx={{ mt: 3 }}
        >
          Back to Subscription Management Page
        </Button>
      </Paper>
    </Container>
  );
};

export default SubscriptionDetails;
