// utils/scheduleUtils.ts
import { SCHEDULE_COLORS } from '../constants/colors';
import { addDays, format, parseISO } from 'date-fns';

export const getDayStyles = (dStr: string, todayDashStr: string, minDate: string) => {
  const isToday = dStr === todayDashStr;
  const isPast = dStr < todayDashStr;
  const isConfirmed = dStr > todayDashStr && dStr <= minDate;

  const bgColor = isToday ? SCHEDULE_COLORS.BG_TODAY :
                  isPast ? SCHEDULE_COLORS.BG_PAST :
                  isConfirmed ? SCHEDULE_COLORS.BG_CONFIRMED : SCHEDULE_COLORS.BG_DEFAULT;

  return { isToday, isPast, isConfirmed, bgColor };
};

/**
 * 💡 新規追加：表示するマーカーとテキストを判定
 */
// 環境変数を取得（Viteの場合）
const MARKERS = {
  SALARY: import.meta.env.VITE_MARKER_SALARY || '🟦',
  SCHEDULE: import.meta.env.VITE_MARKER_SCHEDULE || '🟢',
  DRAFT: import.meta.env.VITE_MARKER_DRAFT || '🟠',
  ALERT: import.meta.env.VITE_MARKER_ALERT || '⚠️',
};

export const getScheduleMarker = (
  dStr: string,
  todayDashStr: string,
  minDate: string,
  data: { salary?: any; schedule?: any; request?: any }
) => {
  const { salary, schedule, request } = data;

  // 1. 給与情報あり
  if (salary) {
    return { icon: MARKERS.SALARY, info: `¥${salary.amount.toLocaleString()}` };
  }
  
  if (dStr < todayDashStr) return null;

  // 2. シフト予定あり
  if (schedule) {
    return { icon: MARKERS.SCHEDULE, info: `${schedule.startTime}〜` };
  }

  // --- 提出期限の判定 ---
  const todayDate = parseISO(todayDashStr);
  const minDateDate = parseISO(minDate);
  const baseDate = todayDate > minDateDate ? todayDate : minDateDate;
  const deadlineStr = format(addDays(baseDate, 7), 'yyyy-MM-dd');

  const isInDeadline = dStr <= deadlineStr;
  const isSubmitted = request?.status === 'submitted';
  const isDraft = request?.status === 'draft';

  // 3 & 4. ⚠️ と 🟠 の判定
  if (isInDeadline && !isSubmitted) {
    // 下書きがあれば ⚠️ と 🟠 を並べる（これも環境変数から）
    const icon = isDraft ? `${MARKERS.ALERT}${MARKERS.DRAFT}` : MARKERS.ALERT;
    return { icon, info: '' };
  }

  return null;
};