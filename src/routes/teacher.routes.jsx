import { lazy } from "react";

const Teachers = lazy(() => import("../pages/teacher/Teachers"));
const CreateTeacher = lazy(()=>import("../pages/teacher/CreateTeacher"));

export const teacherRoutes = [
  {
    path: "teachers/all",
    element: <Teachers />,
  },
    {
    path: "teachers/add",
    element: <CreateTeacher/>,
  },
];