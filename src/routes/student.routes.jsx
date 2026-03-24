import { lazy } from "react";

const Student = lazy(() => import("../pages/student/Students"));

export const studentRoutes = [
  {
    path: "students",
    element: <Student />,
  },
];