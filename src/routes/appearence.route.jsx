import { lazy } from "react";

const Colors = lazy(() => import("../pages/appearence/Colors"));

export const appearenceRoutes = [
  {
    path: "settings/appearance/colors",
    element: <Colors />,
  },
];