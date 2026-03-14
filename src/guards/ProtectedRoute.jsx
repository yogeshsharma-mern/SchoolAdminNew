import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";



export default function ProtectedRoute({ redirectPath = "/" }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render nested routes
  return <Outlet />;
}
