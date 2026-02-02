
interface ScheduleDetailViewProps {
  /** 各種データ（表示の有無判定に使用） */
  schedule: any;
  onEditClick: ()=> void;
}

// ScheduleDetailView.tsx
export const ScheduleDetailView: React.FC<ScheduleDetailViewProps> = ({
  schedule,
  onEditClick,
}) => {

  return (
    <div 
      onClick={onEditClick} 
      style={{
        padding: '16px',
        backgroundColor: '#f6ffed', // 予定用（薄い緑）
        border: '1px solid #b7eb8f',
        borderRadius: '8px',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>🟢 シフト確定済み</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>
            {schedule.startTime} 〜 {schedule.endTime}
          </div>
        </div>
        <div style={{ color: '#1890ff', fontSize: '14px' }}>変更する ＞</div>
      </div>
    </div>
  );
};