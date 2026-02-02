/*
    権限ロール
*/

import { LABEL } from "./japan";

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CAST: 'cast',
  USER: 'user',
  UNKNOWN: 'unknown',
  GUEST:  'guest',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// 役割の表示名も追加して揃える！
export const ROLE_LABELS = {
  [ROLES.ADMIN]:      LABEL.ROLES.ADMIN,
  [ROLES.STAFF]:      LABEL.ROLES.STAFF,
  [ROLES.CAST]:       LABEL.ROLES.CAST,
  [ROLES.USER]:       LABEL.ROLES.USER,
  [ROLES.UNKNOWN]:    LABEL.ROLES.UNKNOWN,
  [ROLES.GUEST]:      LABEL.ROLES.GUEST,
} as const;
