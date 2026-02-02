import React, { useState } from 'react';
import ScheduleList from './ScheduleList';
import { CalendarView } from './CalendarView';
import { DayDetailView } from './DayDetailView';
import SubmitConfirmModal from './SubmitConfirmModal';
import type { Salary } from '../types/salary';
import type { ShiftRequestUI } from '../types/shiftRequest';

interface ScheduleManagerProps {
  isMobile: boolean;
  salaries: Record<string, Salary>;
  schedules: Record<string, any>;
  requests: Record<string, ShiftRequestUI>;
  employees: any;
  dirtyRequests: ShiftRequestUI[];
  minDate: string;
  todayDashStr: string;
  onUpdateMemory: (date: string, data: any) => void;
  onSave: () => void;
  onExecuteSubmit: (dates: string[]) => Promise<boolean>;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = (props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(props.todayDashStr);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleOpenSubmitModal = () => {
    if (props.dirtyRequests.length === 0) {
      alert("変更された内容がありません");
      return;
    }
    setIsSubmitModalOpen(true);
  };

  const handleExecuteSubmit = async (dates: string[]) => {
    const success = await props.onExecuteSubmit(dates);
    if (success) {
      setIsSubmitModalOpen(false);
    }
  };

  return (
    <>
      <div style={calendarWrapperStyle}>
        {props.isMobile ? (
          <ScheduleList 
            {...props}
            selectedDate={selectedDate} 
            onDateClick={setSelectedDate}
          />
        ) : (
          <CalendarView 
            {...props}
            selectedDate={selectedDate} 
            onDateClick={setSelectedDate}
          />
        )}
      </div>

      {selectedDate && (
        <div style={{ marginTop: '10px' }}>
          <DayDetailView
            {...props}
            selectedDate={selectedDate}
            todayDashStr={props.todayDashStr}
            minDate={props.minDate}
            salary={props.salaries[selectedDate]}
            schedule={props.schedules[selectedDate]}
            request={props.requests[selectedDate]} 
            onUpdateMemory={props.onUpdateMemory} 
            onSave={props.onSave}
            onSubmit={handleOpenSubmitModal}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}

      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        dirtyRequests={props.dirtyRequests}
        onExecute={handleExecuteSubmit}
      />
    </>
  );
};

const calendarWrapperStyle: React.CSSProperties = { 
  backgroundColor: '#fff', 
  borderRadius: '8px', 
  padding: '10px', 
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
  marginBottom: '20px' 
};