import { dashboardRoutes } from "./dashboard.routes";
import { appearenceRoutes } from "./appearence.route";
// import { studentRoutes } from "./student.routes";
// import { teacherRoutes } from "./teacher.routes";

export const adminRoutes = [
  ...dashboardRoutes,
  ...appearenceRoutes
//   ...studentRoutes,
//   ...teacherRoutes,
];