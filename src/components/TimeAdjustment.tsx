import React, { useState } from 'react';
import { 
  getMinutesFromBusinessStart, 
  formatBusinessTimeFromMinutes 
} from '../utils/timeUtils';

interface TimeAdjustmentProps {
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  minLimit?: string;
  maxLimit?: string;
  compareValue?: string;
  compareMode: 'isBefore' | 'isAfter';
}

export default function TimeAdjustment({ 
  value, onChange, disabled, minLimit, maxLimit, compareValue, compareMode 
}: TimeAdjustmentProps) {
  const [startY, setStartY] = useState<number | null>(null);

  const handleSwipeUpdate = (diffMinutes: number) => {
    if (disabled) return;

    const currentMinutes = getMinutesFromBusinessStart(value);
    const nextTotalMinutes = currentMinutes + diffMinutes;
    const nextTimeStr = formatBusinessTimeFromMinutes(nextTotalMinutes);
    const nextVal = getMinutesFromBusinessStart(nextTimeStr);

    // 1. 営業範囲制限
    if (minLimit && nextVal < getMinutesFromBusinessStart(minLimit)) return;
    if (maxLimit && nextVal > getMinutesFromBusinessStart(maxLimit)) return;

    // 2. 出退勤の逆転防止
    if (compareValue) {
      const targetVal = getMinutesFromBusinessStart(compareValue);
      if (compareMode === 'isBefore' && nextVal >= targetVal) return;
      if (compareMode === 'isAfter' && nextVal <= targetVal) return;
    }

    onChange(nextTimeStr);
  };

  const onStart = (e: any) => { 
    if(disabled) return;
    setStartY('touches' in e ? e.touches[0].clientY : e.clientY); 
  };

  const onMove = (e: any) => {
    if (startY === null || disabled) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = startY - y;

    if (Math.abs(diff) > 40) {
      handleSwipeUpdate(diff > 0 ? 30 : -30);
      setStartY(y);
    }
  };

  const onEnd = () => setStartY(null);

  return (
    <div 
      onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
      onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
      style={{ 
        ...pickerStyle, 
        opacity: disabled ? 0.5 : 1,
        borderColor: startY !== null ? '#007bff' : '#ccc',
        cursor: disabled ? 'default' : 'ns-resize'
      }}
    >
      <div style={timeStyle}>{value}</div>
    </div>
  );
}

const pickerStyle: React.CSSProperties = { 
  display: 'inline-flex', 
  padding: '12px 24px', 
  backgroundColor: '#f8f9fa', 
  borderRadius: '12px', 
  border: '2px solid #ccc', 
  userSelect: 'none', 
  touchAction: 'none',
  transition: 'border-color 0.2s ease'
};

const timeStyle: React.CSSProperties = { 
  fontSize: '32px', 
  fontWeight: 'bold', 
  fontFamily: 'monospace',
  color: '#333'
};