import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../guards/ProtectedRoute";
import PublicRoute from "../guards/PublicRoute";

import { adminRoutes } from "../routes";
import { authRoutes } from "../routes/auth.routes";

export const router = createBrowserRouter([
  
  /* PUBLIC ROUTES */
  {
    element: <PublicRoute />,
    children: authRoutes,
  },

  /* PROTECTED ROUTES */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: adminRoutes,
      },
    ],
  },
]);