import { lazy } from "react";

const Subjects = lazy(() => import("../pages/subjects/Subjects"));

export const subjectsRoutes = [
  {
    path: "subjects",
    element: <Subjects />,
  },
];