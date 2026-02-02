import { ROLES } from '../constants/roles';
import type { Role } from 'firebase/ai';

/**
 * ユーザーが管理者（Admin）かどうかを判定する
 */
export const isAdmin = (role: Role | string | undefined): boolean => {
  return role === ROLES.ADMIN;
};

/**
 * 出勤ボタンを表示すべきユーザー（Staffなど）かどうかを判定する
 */
export const isStaff = (role: Role | string | undefined): boolean => {
  return role === ROLES.STAFF;
};

export const isShopStaff = (role: Role | string | undefined): boolean => {
  return role === ROLES.STAFF || role === ROLES.ADMIN;
};
