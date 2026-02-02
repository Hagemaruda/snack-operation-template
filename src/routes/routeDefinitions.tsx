/*
  routeDefinitions.tsx
    ルート定義
        画面を追加した場合はここに追加すること！
        画面ごとに使用できる権限を記載することで画面の使用可否を設定する

    format
  {
    path:
    slement:
    allowdRoles: []
  },

*/

import Home from "../pages/Home";
//import AuthLink from "../pages/AuthLink";
//import Message from "../pages/Message";

import { ROLES, type Role } from "../constants/roles";

export interface RouteDefinition {
  path: string;
  element: React.ReactNode;
  allowedRoles: readonly Role[];
}

export const PROTECTED_ROUTES: RouteDefinition[] = [
  {
    path: "/home",
    element: <Home />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CAST, ROLES.USER],
  },
/*
  {
    path: "/authLink",
    element: <AuthLink />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CAST],
  },
*/
/*
  {
    path: "/employeesRegist",
    element: <EmployeesRegist />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF],
  },
*/
/*
  {
    path: "/message",
    element: <Message />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CAST, ROLES.USER],
  },
*/
];