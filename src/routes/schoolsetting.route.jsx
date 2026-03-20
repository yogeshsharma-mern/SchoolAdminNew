import { lazy } from "react";

const SchoolSetting = lazy(() => import("../pages/school-setting/SchoolSetting"));

export const schoolSettingRoute = [
  {
    path: "settings/school-setting",
    element: <SchoolSetting />,
  },
];