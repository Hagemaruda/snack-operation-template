import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';
import { CalendarDayView } from './CalendarDayView';
import type { ScheduleCommonProps } from '../types/schedule';
import { SCHEDULE_COLORS } from '../constants/colors';
import { getDayStyles, getScheduleMarker } from '../utils/schdules';

export const CalendarView: React.FC<ScheduleCommonProps> = (props) => {
  const { salaries, schedules, requests, selectedDate, minDate, todayDashStr, onDateClick } = props;
  
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });


  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
      {['日', '月', '火', '水', '木', '金', '土'].map((w, i) => (
        <div key={w} style={{ padding: '8px 0', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', background: '#f8f9fa', borderBottom: '1px solid #eee', color: i === 0 ? SCHEDULE_COLORS.TEXT_SUNDAY : i === 6 ? SCHEDULE_COLORS.TEXT_SATURDAY : SCHEDULE_COLORS.TEXT_DEFAULT }}>
          {w}
        </div>
      ))}

      {days.map((date) => {
        const dStr = format(date, 'yyyy-MM-dd');
        const { bgColor } = getDayStyles(dStr, todayDashStr, minDate); // 💡 共通ロジック使用
        const dayOfWeek = date.getDay();
        const textColor = dayOfWeek === 0 ? SCHEDULE_COLORS.TEXT_SUNDAY : dayOfWeek === 6 ? SCHEDULE_COLORS.TEXT_SATURDAY : SCHEDULE_COLORS.TEXT_DEFAULT;
        const borderColor = (dStr === selectedDate) ? SCHEDULE_COLORS.BORDER_SELECTED_CAL : 'transparent';

        // 💡 ここでマーカーを取得
        const marker = getScheduleMarker(dStr, todayDashStr, minDate, {
            salary: salaries[dStr],
            schedule: schedules[dStr],
            request: requests[dStr]
        });

        
        return (
          <CalendarDayView
            key={dStr}
            dateNum={date.getDate()}
            isCurrentMonth={isSameMonth(date, monthStart)}
            bgColor={bgColor}
            textColor={textColor}
            borderColor={borderColor}

            // 💡 共通ロジックの結果をそのまま流し込む
            markerIcon={marker?.icon}
            markerInfo={marker?.info}

            onClick={() => onDateClick(dStr)} 
          />
        );
      })}
    </div>
  );
};