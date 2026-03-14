import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
// const ResetPassword = lazy(() => import("../pages/ResetPassword"));

export const authRoutes = [
    {
        path: "/",
        element: <Login />,
    },
    //   {
    //     path: "/reset-password",
    //     element: <ResetPassword />,
    //   },
];