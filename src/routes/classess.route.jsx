import { lazy } from "react";

const Classess = lazy(() => import("../pages/class/Classes"));
const Sections = lazy(()=>import("../pages/class/Sections"));

export const classesRoute = [
  {
    path: "classes",
    element: <Classess />,
  },
  {
    path:"Classes/sections",
    element:<Sections/>
  }
];