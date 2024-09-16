import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UseAuth } from "../context/authContext";
import Loader from "../components/common/Loader";

interface ProtectedRouteProps {
  isProtected: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isProtected }) => {
  const { authenticated } = UseAuth();

  if (authenticated === null) {
    return <Loader isLoading={true} />;
  }

  if (isProtected && !authenticated) {
    return <Navigate to="/" />;
  }

  if (!isProtected && authenticated) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
