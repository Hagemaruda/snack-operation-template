/*
  出勤に関する定数
*/

import { ROLES, type Role } from "../constants/roles";

//  状況
export const ATTENDANCE_STATUS = {
  //  未出勤の状況
  SHIFT_NOTHING: 'noShift',           //  シフト予定に入っていない
  PRE_WORK: 'preWork',                //  シフト予定の出勤時刻前
  LATENESS: 'lateness',               //  シフト予定の出勤時刻後（遅刻状態）
  SHIFT_CANCEL: 'shiftCancel',        //  シフト予定取消
  //  出勤の状況
  WORK_IN: 'workIn',                  //  出勤申請中
  WORKING: 'working',                 //  仕事中
  WORK_FINISH: 'workFinish'           //  仕事後
} as const;

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_LABELS = {
  [ATTENDANCE_STATUS.SHIFT_NOTHING]: '出勤予定なし',
  [ATTENDANCE_STATUS.PRE_WORK]: '出勤予定あり',
  [ATTENDANCE_STATUS.LATENESS]: '出勤時刻超過',
  [ATTENDANCE_STATUS.SHIFT_CANCEL]: '出勤取消',
  [ATTENDANCE_STATUS.WORK_IN]: '出勤申請中',
  [ATTENDANCE_STATUS.WORKING]: '出勤中',
  [ATTENDANCE_STATUS.WORK_FINISH]: '退勤',
} as const;

/*
    当日出勤者の閲覧ができるか
*/
export const isShiftScheduleViewPermission = (( attendanceStatus: AttendanceStatus, role: Role ): boolean => {
  if (role === ROLES.ADMIN) return true;
  if (role === ROLES.STAFF) return true;
  switch(attendanceStatus) {
    case ATTENDANCE_STATUS.PRE_WORK:
    case ATTENDANCE_STATUS.LATENESS:
    case ATTENDANCE_STATUS.WORK_IN:
    case ATTENDANCE_STATUS.WORKING:
    case ATTENDANCE_STATUS.WORK_FINISH:
      return true;
    default:
      return false;
  }
});

//  当日出勤者チャット対象（使用可能か）
export const isShopMessegaPermission = (( attendanceStatus: AttendanceStatus, role: Role ): boolean => {
  if (role === ROLES.ADMIN) return true;
  if (role === ROLES.STAFF) return true;
  switch(attendanceStatus) {
    case ATTENDANCE_STATUS.PRE_WORK:
    case ATTENDANCE_STATUS.LATENESS:
    case ATTENDANCE_STATUS.WORK_IN:
    case ATTENDANCE_STATUS.WORKING:
    case ATTENDANCE_STATUS.WORK_FINISH:
      return true;
    default:
      return false;
  }
});



/*

export type AttendanceUI = {
  label: string;
  bg: string;
  color: string;
};

export const ATTENDANCE_UI_CONFIG: Record<string, AttendanceUI> = {
  UNSET: { label: "未出勤", bg: "#000", color: "#fff" },
  [ATTENDANCE_STATUS.WORK_IN]: { label: ATTENDANCE_LABELS[ATTENDANCE_STATUS.WORK_IN], bg: "#e8f5e9", color: "#000" },
  [ATTENDANCE_STATUS.PRE_APPROVAL]: { label: ATTENDANCE_LABELS[ATTENDANCE_STATUS.PRE_APPROVAL], bg: "#2e7d32", color: "#fff" },
  [ATTENDANCE_STATUS.APPROVAL]: { label: ATTENDANCE_LABELS[ATTENDANCE_STATUS.APPROVAL], bg: "#1976d2", color: "#fff" },
  [ATTENDANCE_STATUS.LEFT]: { label: ATTENDANCE_LABELS[ATTENDANCE_STATUS.LEFT], bg: "#9e9e9e", color: "#fff" },
} as const;



*/