import React, { useState } from 'react';
import { getMinutesFromBusinessStart, formatBusinessTimeFromMinutes } from '../../utils/timeUtils';

export interface TimePickerProps {
  value: string;
  step: 15 | 30;
  onChange: (time: string) => void;
  label: string;
  disabled?: boolean;
  // 💡 バリデーション用のPropsを追加
  minLimit?: string;
  maxLimit?: string;
  compareValue?: string;
  compareMode?: 'isBefore' | 'isAfter';
}

export default function TimeWheelPicker({ 
  value, step, onChange, label, disabled,
  minLimit, maxLimit, compareValue, compareMode 
}: TimePickerProps) {
  
  const [startY, setStartY] = useState<number | null>(null);

  // 💡 スワイプで時間を動かすメインロジック
  const handleSwipeUpdate = (diffMinutes: number) => {
    if (disabled) return;

    // 1. 10時起点での現在の「分」を取得
    const currentMinutes = getMinutesFromBusinessStart(value);
    // 2. スワイプ方向に step (30分など) を加減算
    const nextTotalMinutes = currentMinutes + diffMinutes;
    
    // 3. 一旦 "HH:mm" に戻してバリデーション
    const nextTimeStr = formatBusinessTimeFromMinutes(nextTotalMinutes);
    const nextVal = getMinutesFromBusinessStart(nextTimeStr);

    // --- バリデーション発動 ---
    // A. 営業時間外 (21:00未満 or 10:00超) なら中止
    if (minLimit && nextVal < getMinutesFromBusinessStart(minLimit)) return;
    if (maxLimit && nextVal > getMinutesFromBusinessStart(maxLimit)) return;

    // B. 出退勤の逆転防止
    if (compareValue) {
      const targetVal = getMinutesFromBusinessStart(compareValue);
      if (compareMode === 'isBefore' && nextVal >= targetVal) return;
      if (compareMode === 'isAfter' && nextVal <= targetVal) return;
    }

    onChange(nextTimeStr);
  };

  // --- スワイプ判定 (ここがスワイプのキモ) ---
  const onStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
  };

  const onMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startY === null || disabled) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = startY - clientY;

    // 40ピクセル動かすごとに1回更新
    if (Math.abs(diff) > 40) {
      // 指を上に動かす(diff>0)と時間を進める、下に動かすと戻す
      handleSwipeUpdate(diff > 0 ? step : -step);
      setStartY(clientY); // 起点を更新して連続スワイプを可能にする
    }
  };

  const onEnd = () => setStartY(null);

  return (
    <div style={{ ...pickerContainer, opacity: disabled ? 0.3 : 1 }}>
      <span style={pickerLabel}>{label}</span>
      <div 
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        style={{ 
          ...wheelWrap, 
          borderColor: startY !== null ? "#007bff" : "#000",
          backgroundColor: disabled ? "#f5f5f5" : "#fff",
          cursor: disabled ? 'default' : 'ns-resize',
          touchAction: 'none' // 👈 スマホのブラウザスクロールを止めてスワイプを優先
        }}
      >
        <div style={timeValue}>{value}</div>
      </div>
    </div>
  );
}

// スタイル
const pickerContainer = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px' };
const pickerLabel = { fontSize: '12px', fontWeight: 'bold', color: '#666' };
const wheelWrap = { 
  display: 'flex', alignItems: 'center', justifyContent: 'center', 
  border: '2px solid #000', borderRadius: '8px', padding: '12px 16px', 
  userSelect: 'none' as const, transition: 'all 0.1s' 
};
const timeValue = { fontSize: '28px', fontWeight: 'bold', color: '#000', fontFamily: 'monospace' };