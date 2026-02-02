import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getBusinessDateStr } from '../utils/timeUtils';
import { ATTENDANCE_STATUS, ATTENDANCE_ACTION, ATTENDANCE_LABELS } from '../services/attendance';
import { useDailyAttendance } from '../hooks/useDailyAttendance';
import AttendanceActionModal from './AttendanceActionModal';

// DailyShiftStatusList.tsx
interface Props {
  userRole?: string;
  currentUid?: string; // 💡 追加
}

export default function DailyShiftStatusList({ userRole, currentUid }: Props) {
  // 💡 フックに第2引数として currentUid を渡す
  const { items, isVisible, loading } = useDailyAttendance(userRole, currentUid);
  const [selected, setSelected] = useState<{ member: any, actions: string[] } | null>(null);
  const businessDateStr = getBusinessDateStr(new Date());

  const handleActionConfirm = async (action: string, time: string) => {
    if (!selected) return;
    const { member } = selected;
    let updateData: any = { name: member.name, uid: member.uid };

    switch (action) {
      case ATTENDANCE_ACTION.ENTRY_REQUEST:
      case ATTENDANCE_ACTION.RE_APPLY:
        updateData = { ...updateData, state: ATTENDANCE_STATUS.WORK_IN, checkIn: time };
        break;
      case ATTENDANCE_ACTION.ENTRY_PRE_APPROVE:
        updateData = { ...updateData, state: ATTENDANCE_STATUS.PRE_APPROVAL, checkIn: time };
        break;
      case ATTENDANCE_ACTION.ENTRY_APPROVE:
        updateData = { ...updateData, state: ATTENDANCE_STATUS.APPROVAL, checkIn: time };
        break;
      case ATTENDANCE_ACTION.CANCEL:
        updateData = { ...updateData, state: ATTENDANCE_STATUS.REQUEST_CANCEL, checkIn: member.checkIn };
        break;
      case ATTENDANCE_ACTION.LEAVE:
        updateData = { ...updateData, state: ATTENDANCE_STATUS.LEFT, leaveTime: time };
        break;
    }

    await setDoc(doc(db, "attendance", businessDateStr, "members", member.uid), updateData, { merge: true });
    setSelected(null);
  };

  if (loading || !isVisible) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <h2 style={{ fontSize: '16px', color: '#555', marginBottom: '12px', paddingLeft: '4px' }}>📊 本日のシフト状況</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((m) => {
          const isActionable = m.actions.length > 0;
          const styles = getStatusStyles(m.status);
          return (
            <div key={m.id} style={{ ...cardBaseStyle, ...styles.card, cursor: isActionable ? 'pointer' : 'default' }} 
                 onClick={() => isActionable && setSelected({ member: m, actions: m.actions })}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>{m.name}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: styles.labelBg, color: styles.labelColor }}>
                    {styles.labelText}
                  </span>
                  {m.isExtra && <span style={{ fontSize: '10px', color: '#ff7a45' }}>[予定外]</span>}
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
                  予定: {m.planStart} 〜 {m.planEnd}
                  {m.checkIn && <span style={{ marginLeft: '10px', color: '#1890ff' }}>出勤: {m.checkIn}</span>}
                </div>
              </div>
              {isActionable && <div style={{ fontSize: '12px', color: '#007bff' }}>操作 ＞</div>}
            </div>
          );
        })}
      </div>
      {selected && (
        <AttendanceActionModal member={selected.member} actions={selected.actions} onConfirm={handleActionConfirm} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// getStatusStyles, cardBaseStyle は前回同様のため維持
const getStatusStyles = (status: any) => {
    const label = ATTENDANCE_LABELS[status as keyof typeof ATTENDANCE_LABELS] || (status === 'LATE' ? '未出勤(遅刻)' : '未出勤');
  
    // 💡 型を React.CSSProperties に指定することで、opacity 等も許可されるようになります
    let cardStyle: React.CSSProperties = { backgroundColor: '#fff', border: '1px solid #f0f0f0' };
    let labelColor = '#8c8c8c', labelBg = '#f5f5f5';  if (status === ATTENDANCE_STATUS.APPROVAL) { cardStyle = { backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' }; labelColor = '#0050b3'; labelBg = '#bae7ff'; }
    else if (status === ATTENDANCE_STATUS.PRE_APPROVAL) { cardStyle = { backgroundColor: '#e6f7ff', border: '1px dotted #1890ff' }; labelColor = '#0050b3'; labelBg = '#bae7ff'; }
    else if (status === ATTENDANCE_STATUS.WORK_IN) { cardStyle = { backgroundColor: '#fff2f0', border: '1px solid #ffccc7' }; labelColor = '#cf1322'; labelBg = '#ffccc7'; }
    else if (status === ATTENDANCE_STATUS.LEFT) {
        cardStyle = { backgroundColor: '#fafafa', border: '1px solid #d9d9d9', opacity: 0.8 }; labelColor = '#595959'; labelBg = '#d9d9d9';    }
    return { card: cardStyle, labelText: label, labelColor, labelBg };
};
const cardBaseStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '14px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };