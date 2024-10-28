import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export const useAuth = (allowedRoles: string[]) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const effectRan = useRef(false); // A flag to prevent multiple executions

  useEffect(() => {
    if (effectRan.current) return; // Prevent further execution if it already ran
    effectRan.current = true; // Set the flag to true

    const getRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/get-role`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setUserRole(response.data.userRole);
        if (!allowedRoles.includes(response.data.userRole || "")) {
          navigate("/"); // Redirect non-allowed users to the login page
          alert(`Access Denied`);
        }
      } catch (error) {
        navigate("/"); // Redirect not logged-in users to the login page
        if (axios.isAxiosError(error)) {
          // Type assertion to narrow the type
          const axiosError = error as AxiosError<{ message: string }>;
          console.error("Axios Error:", axiosError.response);
          alert(axiosError.response?.data.message || "An error occurred");
        } else {
          console.error("Unknown Error:", error);
          alert("Unknown Error");
        }
      } finally {
        setLoading(false); // Mark as not loading once the request is done
      }
    };

    getRole();
  }, [allowedRoles, navigate, token]);

  return { userRole, loading }; // Return both role and loading status
};
