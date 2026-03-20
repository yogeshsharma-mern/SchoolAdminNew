import { lazy } from "react";

const Classess = lazy(() => import("../pages/class/Classes"));

export const classesRoute = [
  {
    path: "classes",
    element: <Classess />,
  },
];