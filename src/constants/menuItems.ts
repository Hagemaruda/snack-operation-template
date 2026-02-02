import { ROLES } from "./roles";
import type { Role } from "./roles";

export interface MenuItem {
  label: string;
  path: string;
  roles: Role[];
}

export const MENU_ITEMS: MenuItem[] = [
  { label: "ホーム", path: "/home", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CAST] },
  { label: "従業員登録", path: "/employeesRegist", roles: [ROLES.ADMIN, ROLES.STAFF] },
  { label: "メッセージ", path: "/message", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CAST] },
  { label: "認証設定", path: "/authLink", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.CAST] },
];