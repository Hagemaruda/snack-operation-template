import React, { useState, useEffect } from 'react';
import { ATTENDANCE_STATUS, ATTENDANCE_ACTION } from '../services/attendance';
import { getNext15MinSlot } from '../utils/timeUtils';
import TimeAdjustment from './TimeAdjustment';

interface Props {
  member: any;
  actions: string[];
  onConfirm: (action: string, time: string) => void;
  onClose: () => void;
}

export default function AttendanceActionModal({ member, actions, onConfirm, onClose }: Props) {
  const [adjustTime, setAdjustTime] = useState("");

  useEffect(() => {
    // 💡 仕様：退勤の時は今の時刻、それ以外は記録されている時刻（なければ今）を初期値に
    if (actions.includes(ATTENDANCE_ACTION.LEAVE)) {
      setAdjustTime(getNext15MinSlot(new Date()));
    } else {
      setAdjustTime(member.checkIn || getNext15MinSlot(new Date()));
    }
  }, [actions, member]);

  // アクション名と表示ラベルの変換
  const getActionLabel = (action: string) => {
    switch (action) {
      case ATTENDANCE_ACTION.ENTRY_REQUEST: return "出勤申請";
      case ATTENDANCE_ACTION.ENTRY_PRE_APPROVE: return "出勤仮承認";
      case ATTENDANCE_ACTION.ENTRY_APPROVE: return "出勤承認";
      case ATTENDANCE_ACTION.CANCEL: return "申請取消";
      case ATTENDANCE_ACTION.RE_APPLY: return "再申請";
      case ATTENDANCE_ACTION.LEAVE: return "退勤";
      default: return "確定";
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginBottom: '8px' }}>{member.name} さん</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          現在の状態：{member.status === 'UPCOMING' ? '未出勤' : (member.status === 'LATE' ? '未出勤(遅刻)' : '不明')}
        </p>

        {/* 💡 時刻修正：CANCEL（取消）以外が含まれる場合のみ表示 */}
        {actions.some(a => a !== ATTENDANCE_ACTION.CANCEL) && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>時刻調整</label>
            <TimeAdjustment value={adjustTime} onChange={setAdjustTime} compareMode={'isBefore'} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {actions.map(action => (
            <button
              key={action}
              onClick={() => onConfirm(action, adjustTime)}
              style={action === ATTENDANCE_ACTION.CANCEL ? cancelBtnStyle : confirmBtnStyle}
            >
              {getActionLabel(action)}
            </button>
          ))}
          <button onClick={onClose} style={closeBtnStyle}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

// スタイル定義（後述の親コンポーネントと共通化も可）
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '350px' };
const confirmBtnStyle = { backgroundColor: '#ff4d4f', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { backgroundColor: '#fff', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '12px', borderRadius: '4px', cursor: 'pointer' };
const closeBtnStyle = { backgroundColor: '#eee', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', marginTop: '4px' };