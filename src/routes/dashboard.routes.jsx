import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.jsx"));

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
];