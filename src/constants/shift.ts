/*
  シフトに関する定数
*/

//  勤怠
export const SHIFT_ACTION = {
  WORK: 'work',
  REST: 'rest',
  MEMBER_WORK: 'menberWork',
  UNKNOWN: 'unknown', 
} as const;

export type ShiftAction = typeof SHIFT_ACTION[keyof typeof SHIFT_ACTION];

export const SHIFT_ACTION_LABELS = {
  [SHIFT_ACTION.WORK]: '出勤',
  [SHIFT_ACTION.REST]: '休み',
  [SHIFT_ACTION.MEMBER_WORK]: 'メンバー出勤',
  [SHIFT_ACTION.UNKNOWN]: '未定', 
} as const;

//　シフト申請の状況
export const SHIFT_REQUEST_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  DERAY: 'deray',
  CONFIRMD: 'confirmd',
  RESUBMITTED: 'resubmitted',
} as const;

export type ShifRequesttStatus = typeof SHIFT_REQUEST_STATUS[keyof typeof SHIFT_REQUEST_STATUS];

export const SHIFT_REQUEST_STATUS_LABELS = {
  [SHIFT_REQUEST_STATUS.DRAFT]: '下書き',
  [SHIFT_REQUEST_STATUS.SUBMITTED]: '提出済',
  [SHIFT_REQUEST_STATUS.DERAY]: '遅延提出',
  [SHIFT_REQUEST_STATUS.CONFIRMD]: '確認済',
  [SHIFT_REQUEST_STATUS.RESUBMITTED]: '再提出',
} as const;