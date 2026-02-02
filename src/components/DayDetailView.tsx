import React, { useState, useEffect } from 'react'; // useEffectを追加
import { SalaryDetailView } from './SalaryDetailView';
import ShiftRequest from './ShiftRequest';
import { ScheduleDetailView } from './ScheduleDetailView';
import { createDefaultUIShift } from '../types/shiftRequest'; // 追加

interface DayDetailViewProps {
  selectedDate: string;
  todayDashStr: string;
  minDate: string;
  salary?: any;
  schedule?: any;
  request?: any;
  employees: any; // 💡 明示的に追加
  onUpdateMemory: (date: string, data: any) => void;
  onSave: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const DayDetailView: React.FC<DayDetailViewProps> = ({
  selectedDate,
  todayDashStr,
  minDate,
  salary,
  schedule,
  request,
  employees, // Propsから受け取る
  onUpdateMemory,
  onSave,
  onSubmit,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);


/*

  // 💡 初期データの注入ロジック
  useEffect(() => {
    if (!request && employee && selectedDate >= todayDashStr) {
      const defaultData = createDefaultUIShift(employee.uid, employee.name, selectedDate);
      onUpdateMemory(selectedDate, defaultData);
    }
  }, [selectedDate, request, employee, onUpdateMemory, todayDashStr]);

*/

// 💡 マウント時、データがないなら親の handleUpdateMemory を叩いて初期値を生成させる
  useEffect(() => {
    if (!request && employees && selectedDate >= todayDashStr) {
      onUpdateMemory(selectedDate, {}); 
    }
  }, [selectedDate, request, employees, onUpdateMemory, todayDashStr]);


  const isPast = selectedDate < todayDashStr;
  const hasSalary = !!salary;

  if (isPast && !hasSalary) return null;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      {salary ? (
        <SalaryDetailView salary={salary} />
      ) : (
        selectedDate >= todayDashStr && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {schedule && !isEditing && (
              <ScheduleDetailView 
                schedule={schedule} 
                onEditClick={() => setIsEditing(true)} 
              />
            )}
            {(!schedule || isEditing) && (
              <ShiftRequest 
                selectedDate={selectedDate}
                request={request}
                minDate={minDate}
                onUpdateMemory={onUpdateMemory} 
                onSave={onSave} 
                onSubmit={onSubmit}
                onCancel={() => {
                  if (schedule) setIsEditing(false);
                  else onClose();
                }} 
              />
            )}
          </div>
        )
      )}
      <button style={closeButtonStyle} onClick={onClose}>閉じる</button>
    </div>
  );
};
// closeButtonStyle は既存のまま
const closeButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: '16px',
  backgroundColor: '#fff',
  border: '1px solid #d9d9d9',
  borderRadius: '8px',
  color: '#666',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer'
};