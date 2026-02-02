import type { Salary } from "./salary";
import type { ShiftRequest } from "./shiftRequest";

export interface ScheduleCommonProps {
  salaries: Record<string, Salary>;
  schedules: Record<string, ShiftRequest>;
  requests: Record<string, ShiftRequest>;
  selectedDate: string | null;
  minDate: string;           // 確定済み最終日
  todayDashStr: string;      // 10時基準の今日 (yyyy-MM-dd)
  onDateClick: (dateStr: string) => void;
}