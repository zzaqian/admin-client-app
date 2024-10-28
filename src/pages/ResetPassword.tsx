// src/pages/ResetPassword.tsx
import React from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";

const ResetPassword: React.FC = () => {
  const { loading } = useAuth(["Admin"]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Password Reset</h2>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
