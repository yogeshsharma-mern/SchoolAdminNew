import { lazy } from "react";

const Teachers = lazy(() => import("../pages/teacher/Teachers"));

export const teacherRoutes = [
  {
    path: "teachers/all",
    element: <Teachers />,
  },
];