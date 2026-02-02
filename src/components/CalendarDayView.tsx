import React from 'react';
import type { Salary } from '../types/salary';
import type { ShiftRequest } from '../types/shiftRequest';

interface CalendarDayViewProps {
  /** 日付の数字 (1〜31) */
  dateNum: number;
  /** 当月かどうかの判定（透明度制御用） */
  isCurrentMonth: boolean;
  /** 親で決定された背景色 */
  bgColor: string;
  /** 親で決定された文字色（平日・土日・祝日） */
  textColor: string;
  /** 選択状態の枠線色（非選択時は 'transparent'） */
  borderColor: string;

  // 💡 getScheduleMarker から取得した結果をそのまま受け取る
  /** 表示するアイコン (🟦, 🟢, ⚠️🟠 など) */
  markerIcon?: string;
  /** アイコンに付随する情報 (¥12,000, 10:00〜 など) */
  markerInfo?: string;

  /** 各種データ（表示の有無判定に使用） */
  salary?: Salary;
  schedule?: ShiftRequest;
  request?: ShiftRequest;
  /** クリックイベント */
  onClick: () => void;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  dateNum,
  isCurrentMonth,
  bgColor,
  textColor,
  borderColor,
  markerIcon,
  markerInfo,
  salary,
  schedule,
  request,
  onClick,
}) => {
  // スタイル定義（表示指示に従うのみ）
  const containerStyle: React.CSSProperties = {
    flex: 1,
    minHeight: '80px',
    padding: '4px',
    backgroundColor: bgColor,
    border: '0.5px solid #eee',
    position: 'relative',
    cursor: 'pointer',
    opacity: isCurrentMonth ? 1 : 0.3,
    // 枠線の描画（boxShadow を使うことでレイアウトのガタつきを防止）
    boxShadow: borderColor !== 'transparent' ? `inset 0 0 0 2px ${borderColor}` : 'none',
    zIndex: borderColor !== 'transparent' ? 1 : 0,
    display: 'flex',
    flexDirection: 'column',
    transition: 'background-color 0.2s',
  };

  const dateNumStyle: React.CSSProperties = {
    fontSize: '12px',
    marginBottom: '4px',
    color: textColor,
    fontWeight: 'bold',
  };

  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '10px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div onClick={onClick} style={containerStyle}>
      {/* 日付の数字 */}
      <div style={{ fontSize: '12px', color: textColor, fontWeight: 'bold', marginBottom: '4px' }}>
        {dateNum}
      </div>

      {/* コンテンツエリア */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px' }}>
        {markerIcon && (
          <div style={{ fontSize: '14px', lineHeight: '1.2' }}>
            {markerIcon}
          </div>
        )}
        
        {markerInfo && (
          <div style={{ 
            color: '#333', 
            fontWeight: 'bold', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {markerInfo}
          </div>
        )}
      </div>
    </div>
  );
};