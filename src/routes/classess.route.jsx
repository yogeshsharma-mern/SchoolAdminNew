import { lazy } from "react";

const Classess = lazy(() => import("../pages/class/Classes"));
const Sections = lazy(()=>import("../pages/class/Sections"));
const ClassSubjects=lazy(()=>import('../pages/class/ClassSubjects'));

export const classesRoute = [
  {
    path: "classes",
    element: <Classess />,
  },
  {
    path:"Classes/sections",
    element:<Sections/>
  },
    {
    path:"classes/:id/subjects",
    element:<ClassSubjects/>
  }
];