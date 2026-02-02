import React, { useState } from 'react';
import TimeAdjustment from './TimeAdjustment';
import { getNext15MinSlot } from '../utils/timeUtils';

// 💡 ここで「どんなデータを受け取るか」を定義します
interface AttendanceRequestButtonProps {
  attendanceState: string | null;
  hasShiftToday: boolean;
  onCheckIn: (time: string) => Promise<void>;
}

// 💡 ここに「: AttendanceRequestButtonProps」を追加します
export default function AttendanceRequestButton({ 
  attendanceState, 
  hasShiftToday, 
  onCheckIn 
}: AttendanceRequestButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [checkInTime, setCheckInTime] = useState("");

    const getStatusMessage = () => {
        if (attendanceState === 'request') return '⏳ 出勤申請中';
        if (attendanceState === 'approval') return '✅ 出勤中';
        if (attendanceState === 'left') return '💤 本日の業務終了';
        if (hasShiftToday) return '⏰ 本日は出勤予定です';
        return '☕ 出勤予定はありません';
    };

  const handleOpenModal = () => {
    setCheckInTime(getNext15MinSlot(new Date()));
    setShowModal(true);
  };

  const handleConfirm = async () => {
console.log("!!! ボタン側の handleConfirm が動いた !!!"); // 👈 これを追加
    await onCheckIn(checkInTime);
    setShowModal(false);
  };

  return (
    <>
      <div style={containerStyle}>
        <h2 style={{ marginTop: 0, fontSize: '18px', color: '#333' }}>
          {getStatusMessage()}
        </h2>
        <button 
          disabled={attendanceState !== null} 
          onClick={handleOpenModal}
          style={{ 
            ...btnStyle,
            backgroundColor: attendanceState !== null ? '#ccc' : '#28a745', 
            boxShadow: attendanceState !== null ? 'none' : '0 4px 0 #218838',
            cursor: attendanceState !== null ? 'default' : 'pointer',
          }}
        >
          {attendanceState === 'left' ? 'お疲れ様でした' : 
           attendanceState ? '申請済み' : '出勤する'}
        </button>
      </div>

      {/* モーダル部分もこのコンポーネントが管理する */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>出勤時刻の確認</h3>
            <div style={{ margin: '20px 0' }}>
              <TimeAdjustment value={checkInTime} onChange={setCheckInTime} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={cancelBtnStyle}>キャンセル</button>
              <button onClick={handleConfirm} style={confirmBtnStyle}>申請</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// スタイル定義（省略していたものを整理）
const containerStyle: React.CSSProperties = {
  padding: '20px', backgroundColor: '#fff', borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px', textAlign: 'center'
};
const btnStyle = { padding: '12px 30px', fontSize: '18px', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold' as const, transition: 'all 0.2s' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const modalContentStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', width: '85%', maxWidth: '350px' };
const cancelBtnStyle = { flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#eee' };
const confirmBtnStyle = { flex: 2, padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' as const, cursor: 'pointer' };