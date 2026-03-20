import { lazy } from "react";

const Academicyear = lazy(() => import("../pages/academicyear/AcademicYear"));

export const academicYearRoutes = [
  {
    path: "settings/academic-year",
    element: <Academicyear />,
  },
];