import React, { useEffect, useRef } from 'react';
import { format, addDays, subDays, eachDayOfInterval } from 'date-fns';
import type { ScheduleCommonProps } from '../types/schedule';
import { SCHEDULE_COLORS } from '../constants/colors';
import { getDayStyles, getScheduleMarker } from '../utils/schdules';
import { SHIFT_ACTION } from '../constants/shift';

export default function ScheduleList(props: ScheduleCommonProps) {
  const { salaries, schedules, requests, selectedDate, minDate, todayDashStr, onDateClick } = props;
  
  const now = new Date();
  const dateRange = eachDayOfInterval({ start: subDays(now, 7), end: addDays(now, 21) });
  const todayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (todayRef.current) todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div style={{ background: 'white', borderRadius: '12px', height: '400px', overflowY: 'auto', border: '1px solid #eee' }}>
      {dateRange.map((date) => {
        const dStr = format(date, 'yyyy-MM-dd');
        const { bgColor, isToday } = getDayStyles(dStr, todayDashStr, minDate); // 💡 共通ロジック使用
        const dayOfWeek = date.getDay();
        const textColor = dayOfWeek === 0 ? SCHEDULE_COLORS.TEXT_SUNDAY : dayOfWeek === 6 ? SCHEDULE_COLORS.TEXT_SATURDAY : SCHEDULE_COLORS.TEXT_DEFAULT;
        const isSelected = dStr === selectedDate;

        // 💡 全く同じロジックでマーカーを取得
        const marker = getScheduleMarker(dStr, todayDashStr, minDate, {
          salary: salaries[dStr],
          schedule: schedules[dStr],
          request: requests[dStr]
        });

        return (
          <div 
            key={dStr}
            ref={isToday ? todayRef : null}
            onClick={() => onDateClick(dStr)}
            style={{
              display: 'flex', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid #f9f9f9',
              backgroundColor: bgColor,
              boxShadow: isSelected ? `inset 0 0 0 2px ${SCHEDULE_COLORS.BORDER_SELECTED_LIST}` : 'none',
              cursor: 'pointer', position: 'relative', zIndex: isSelected ? 1 : 0
            }}
          >
            <div style={{ width: '65px', fontSize: '14px', color: textColor }}>
              {format(date, 'M/d')} ({['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]})
            </div>

            {/* 💡 マーカー表示エリア */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              {marker && (
                <>
                  <span style={{ fontSize: '16px' }}>{marker.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{marker.info}</span>
                </>
              )}
            </div>

            {isToday && <div style={{ fontSize: '10px', color: SCHEDULE_COLORS.TEXT_SATURDAY, marginLeft: '8px' }}>今日</div>}
          </div>
        );
      })}
    </div>
  );
}