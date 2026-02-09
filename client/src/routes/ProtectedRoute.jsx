import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

