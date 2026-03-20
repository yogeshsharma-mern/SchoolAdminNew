import { dashboardRoutes } from "./dashboard.routes";
import { appearenceRoutes } from "./appearence.route";
import { classesRoute } from "./classess.route";
import { academicYearRoutes } from "./academicyear.route";
import { schoolSettingRoute } from "./schoolsetting.route";
// import { studentRoutes } from "./student.routes";
// import { teacherRoutes } from "./teacher.routes";

export const adminRoutes = [
  ...dashboardRoutes,
  ...appearenceRoutes,
  ...classesRoute,
  ...academicYearRoutes,
  ...schoolSettingRoute
//   ...studentRoutes,
//   ...teacherRoutes,
];