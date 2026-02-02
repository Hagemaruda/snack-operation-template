import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import { getBusinessDateStr } from '../utils/timeUtils';
import { isAdmin, isStaff } from '../utils/roleUtils';
import TimeAdjustment from './TimeAdjustment';

export default function AttendanceRequestList({ userRole }: { userRole: string | undefined }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [editTime, setEditTime] = useState("");
  const businessDateStr = getBusinessDateStr(new Date());

  useEffect(() => {
    const membersRef = collection(db, "attendance", businessDateStr, "members");
    const q = query(membersRef, where("state", "in", ["request", "pre_approval"]));
    
    const unsub = onSnapshot(q, (snapshot) => {
      // 💡 mapの中で確実に変数を定義してエラーを防ぐ
      const data = snapshot.docs.map(docSnap => {
        const item = docSnap.data();
        return { 
          id: docSnap.id, 
          uid: item.uid,
          name: item.name || "名前不明", 
          checkIn: item.checkIn,
          state: item.state 
        };
      });
      setRequests(data);
    });

    return () => unsub();
  }, [businessDateStr]);

  const handleOpenModal = (req: any) => {
    setSelectedReq(req);
    setEditTime(req.checkIn);
  };

  const handleUpdate = async (nextState: string) => {
    if (!selectedReq) return;
    try {
      const docRef = doc(db, "attendance", businessDateStr, "members", selectedReq.uid);
      await updateDoc(docRef, { 
        state: nextState,
        checkIn: editTime 
      });
      setSelectedReq(null);
    } catch (e) {
      console.error("更新エラー:", e);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '16px', color: '#666' }}>届いている出勤申請</h2>
      
      {requests.map((req) => (
        <div key={req.id} style={cardStyle}>
          <div style={{ flex: 1 }}>
            {/* 💡 リストにも名前を出す */}
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{req.name}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>申請: {req.checkIn}</div>
          </div>
          <button onClick={() => handleOpenModal(req)} style={checkBtnStyle}>確認</button>
        </div>
      ))}

      {selectedReq && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0, fontSize: '14px', color: '#888' }}>申請の確認</h3>
            
            {/* 💡 モーダルで名前をデカデカと表示 */}
            <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>
              {selectedReq.name}
            </div>
            
            <div style={{ margin: '20px 0' }}>
              <TimeAdjustment value={editTime} onChange={setEditTime} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {isAdmin(userRole) && (
                <button onClick={() => handleUpdate('approval')} style={{ ...actionBtnStyle, backgroundColor: '#28a745', color: '#fff' }}>
                  承認して確定
                </button>
              )}
              {isStaff(userRole) && !isAdmin(userRole) && selectedReq.state === 'request' && (
                <button onClick={() => handleUpdate('pre_approval')} style={{ ...actionBtnStyle, backgroundColor: '#ffc107' }}>
                  仮承認する
                </button>
              )}
              <button onClick={() => setSelectedReq(null)} style={{ ...actionBtnStyle, backgroundColor: '#eee' }}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// スタイルは前回と同じなので維持
const cardStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '12px 15px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '10px' };
const checkBtnStyle = { padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '360px' };
const actionBtnStyle = { padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '16px' };