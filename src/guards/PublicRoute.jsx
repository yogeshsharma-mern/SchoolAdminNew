import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ redirectPath = "/admin/dashboard" }) {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Otherwise, render the public page (login, signup, etc.)
    return <Outlet />;
}
