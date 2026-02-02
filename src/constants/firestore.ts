/**
 *  Firestore関係の定数
 */

/**
 *  コレクション名
 *  Firebaseのコレクション名を定数定義したもの（ハードコート禁止）
 */
export const COLLECTIONS = {
  /**
   *  従業員情報
   *  db/employees
   *  @see /src/types/employee.ts
   */
  EMPLOYEES:        'employees',
  ATTENDANCE:       'attendance',
  SHIFT:            'shifts',
  REQUEST:          'request',
  SCHEDULE:         'schedule',
  /**
   *  給与情報
   *  従業員情報のサブコレクション
   *  db/empdoyees/{uid}/wage
   *  @see /src/types/employee.ts
   */
  WAGE:             'wage',
  /**
   *  給与追加支払い情報
   *  従業員情報のサブコレクション
   *  db/empdoyees/{uid}/wageAppend
   *  @see /src/types/employee.ts
   */
  WAGE_APPEND:      'wageAppend',
  /**
   *  従業員更新履歴
   *  db/employeeHistory
   *  @see /src/types/employee.ts
   */
  EMPLOYEES_HISTRY: 'employeesHistory',
  HISTORY:          'history',
} as const;

/*
    パス定義はこんな感じになる
     '`${COLLECTIONS.EMPLOYEES}/${uid}/${COLLECTIONS.SUB_MESSAGES}`',
*/