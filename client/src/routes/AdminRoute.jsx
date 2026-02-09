import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isHydrating } = useAuth();

  if (isHydrating) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/home" replace />;

  return <Outlet />;
};

export default AdminRoute;

