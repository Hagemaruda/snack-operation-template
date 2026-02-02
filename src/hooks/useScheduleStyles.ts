// hooks/useScheduleStyles.ts
export const getScheduleStyles = (dStr: string, todayDashStr: string, minDate: string) => {
  const isToday = dStr === todayDashStr;
  const isPast = dStr < todayDashStr;
  const isConfirmed = dStr > todayDashStr && dStr <= minDate;

  return {
    isToday,
    isPast,
    isConfirmed,
    // 背景色を一元管理
    bgColor: isToday ? '#e6f7ff' : 
             isPast ? '#f5f5f5' : 
             isConfirmed ? '#fff0f6' : '#fff'
  };
};