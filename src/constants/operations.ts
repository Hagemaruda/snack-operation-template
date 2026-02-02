// src/constants/operations.ts

export const OPERATIONS = {
  // 従業員管理
  EMPLOYEE: {
    REGIST: '従業員登録',
    EDIT: '従業員編集',
    DELETE: '従業員削除',
  },
  // 認証系
  AUTH: {
    LINK_EMAIL: 'メール連携',
    LINK_GOOGLE: 'Google連携',
  },
  // 勤怠系
  ATTENDANCE: {
    START: '出勤',
    END: '退勤',
  }
} as const;

// 型を抽出して、addHistoryで使いやすくします
export type OperationValue = 
  | typeof OPERATIONS.EMPLOYEE[keyof typeof OPERATIONS.EMPLOYEE]
  | typeof OPERATIONS.AUTH[keyof typeof OPERATIONS.AUTH]
  | typeof OPERATIONS.ATTENDANCE[keyof typeof OPERATIONS.ATTENDANCE];