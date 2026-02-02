import React, { useState, useEffect } from "react";
import { useShiftRequestForm } from "../hooks/useShiftRequestForm";
import CopyWeekModal from "./CopyWeekModal";
import TimeWheelPicker from "./common/TimeWheelPicker";
import { auth } from "../firebase";

interface ShiftRequestProps {
  selectedDate: string;
  request: any;
  minDate: string;
  onUpdateMemory: (date: string, data: any) => void;
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ShiftRequest({ 
  selectedDate, 
  request, 
  minDate,
  onUpdateMemory, 
  onSave, 
  onSubmit,
  onCancel,
}: ShiftRequestProps) {


  // 💡 親(Home)のメモリにあるデータをそのまま初期値にする
  // DayDetailViewで初期値が注入されるため、ここがundefinedになることはありません
//  const [formData, setFormData] = useState(request);

// 💡 親のメモリを正しく反映させる
  const [formData, setFormData] = useState(request || {});

/*

  useEffect(() => {
    if (request) {
      setFormData(request);
    }
  }, [selectedDate, request]);

*/


useEffect(() => {
    const initialData = {
      workType: request?.workType || "出勤",
      startTime: request?.startTime || import.meta.env.VITE_DEFAULT_START_TIME || "21:00",
      endTime: request?.endTime || import.meta.env.VITE_DEFAULT_END_TIME || "05:00",
      isOpen: request?.isOpen ?? true,
      isLast: request?.isLast ?? true,
      ifTimeChangedSleep: request?.ifTimeChangedSleep || false,
      comment: request?.comment || "",
    };
    setFormData(initialData);
  }, [selectedDate, request]);



  const handleChange = (updates: Partial<any>) => {
    const nextData = { ...formData, ...updates };
    setFormData(nextData);
    onUpdateMemory(selectedDate, nextData);
  };


  const user = auth.currentUser;
  const { isSubmitting } = useShiftRequestForm(user?.uid || "");

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  
  const DEFAULT_START = import.meta.env.VITE_DEFAULT_START_TIME || "21:00";
  const DEFAULT_END = import.meta.env.VITE_DEFAULT_END_TIME || "05:00";

/*  
  // 💡 ローカルステート
  const [formData, setFormData] = useState({
    workType: "出勤",
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
    isOpen: true,
    isLast: true,
    ifTimeChangedSleep: false,
    comment: "",
  });

  // 💡 【ベストプラクティス】入力変更時にローカルと親のメモリを同時に更新する
  // これにより無限ループの原因となる useEffect 監視が不要になります
  const handleChange = (updates: Partial<typeof formData>) => {
    const nextData = { ...formData, ...updates };
    setFormData(nextData);
    onUpdateMemory(selectedDate, nextData);
  };
*/

  // 💡 日付切り替え時のみデータを同期（request の変化は追わないことでループを防ぐ）
  useEffect(() => {
    const initialData = {
      workType: request?.workType || "出勤",
      startTime: request?.startTime || DEFAULT_START,
      endTime: request?.endTime || DEFAULT_END,
      isOpen: request?.isOpen ?? true,
      isLast: request?.isLast ?? true,
      ifTimeChangedSleep: request?.ifTimeChangedSleep || false,
      comment: request?.comment || "",
    };
    setFormData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // --- ハンドラー ---
  const handleOpenLast = () => {
    handleChange({ workType: "出勤", isOpen: true, isLast: true });
  };

  const handleExecuteCopy = (targetDates: string[]) => {
    targetDates.forEach(date => {
      onUpdateMemory(date, { ...formData, status: "draft" });
    });
    setIsCopyModalOpen(false);
    alert("カレンダーに反映しました（保存ボタンで確定してください）");
  };

  return (
    <div style={containerStyle}>
      {/* 1. ヘッダー */}
      <div style={flexSpace}>
        <span style={dateTitle}>{selectedDate.replace(/-/g, " / ")}</span>
        <div style={statusBadge(request?.status || "draft")}>
          {(request?.status || "DRAFT").toUpperCase()}
        </div>
      </div>

      {/* 2. ステータス選択 */}
      <div style={statusGrid}>
        {["出勤", "休み", "メンバ出勤", "未定"].map((label) => (
          <label key={label} style={statusTab(formData.workType === label)}>
            <input 
              type="radio" style={{ display: "none" }} 
              checked={formData.workType === label}
              onChange={() => handleChange({ workType: label })}
            />
            {label}
          </label>
        ))}
      </div>

      {/* 3. 時間入力エリア */}
      <div style={timeCard}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
          
          {/* 出店時刻 */}
          <div style={timeInputGroup}>
            <TimeWheelPicker 
              label="出店" step={30} value={formData.startTime} disabled={formData.isOpen}
              onChange={(val) => handleChange({ startTime: val })}
              minLimit={DEFAULT_START}
              maxLimit="09:30"
              compareValue={formData.endTime}
              compareMode="isBefore"
            />
            <label style={checkLabel}>
              <input type="checkbox" checked={formData.isOpen} onChange={e => handleChange({ isOpen: e.target.checked })} /> 
              オープン
            </label>
          </div>

          {/* 退店時刻 */}
          <div style={timeInputGroup}>
            <TimeWheelPicker 
              label="退店" step={30} value={formData.endTime} disabled={formData.isLast}
              onChange={(val) => handleChange({ endTime: val })}
              minLimit="21:30"
              maxLimit="10:00"
              compareValue={formData.startTime}
              compareMode="isAfter"
            />
            <label style={checkLabel}>
              <input type="checkbox" checked={formData.isLast} onChange={e => handleChange({ isLast: e.target.checked })} /> 
              ラスト
            </label>
          </div>
        </div>

        <label style={conditionLabel}>
          <input type="checkbox" checked={formData.ifTimeChangedSleep} onChange={e => handleChange({ ifTimeChangedSleep: e.target.checked })} />
          出店時刻が変更されるなら休みを希望
        </label>
      </div>

      {/* 4. スケジュール操作ボタン */}
      <div style={{ ...actionRow, marginBottom: '20px' }}>
        <button onClick={handleOpenLast} style={actionBtn}>オープン〜ラスト</button>
        <button onClick={() => setIsCopyModalOpen(true)} style={actionBtn}>1週間展開</button>
      </div>

      {/* 5. コメント欄 */}
      <div style={{ marginBottom: "15px" }}>
        <label style={labelTitle}>コメント</label>
        <textarea 
          style={textAreaStyle} rows={2} placeholder="連絡事項など"
          value={formData.comment} onChange={e => handleChange({ comment: e.target.value })}
        />
      </div>

      {/* 6. 来店情報 */}
      <div style={{ marginBottom: "20px" }}>
        <div style={flexSpace}>
          <label style={labelTitle}>来店情報</label>
          <button type="button" onClick={() => alert("来店追加モーダル")} style={addVisitBtn}>[＋追加]</button>
        </div>
        <div style={visitListArea}>
          <p style={{ fontSize: "12px", color: "#666", textAlign: "center", margin: 0 }}>登録なし</p>
        </div>
      </div>

      {/* 7. 提出・保存ボタン */}
      <div style={actionRow}>
        <button onClick={onSubmit} disabled={isSubmitting} style={submitBtnFull}>提出</button>
        <button onClick={onSave} disabled={isSubmitting} style={saveBtnFull}>下書き保存</button>
      </div>

      <CopyWeekModal 
        baseDate={selectedDate} isOpen={isCopyModalOpen} 
        onClose={() => setIsCopyModalOpen(false)} onExecute={handleExecuteCopy} 
      />
    </div>
  );
}

// --- スタイル定義 ---
const timeInputGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' };
const actionRow: React.CSSProperties = { display: 'flex', gap: '8px', width: '100%' };
const actionBtn: React.CSSProperties = { flex: 1, padding: "12px 8px", backgroundColor: "#fff", color: "#000", border: "2px solid #000", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" };
const submitBtnFull: React.CSSProperties = { ...actionBtn, backgroundColor: "#000", color: "#fff" };
const saveBtnFull: React.CSSProperties = { ...actionBtn, backgroundColor: "#eee", border: "2px solid #ccc" };
const containerStyle: React.CSSProperties = { padding: "16px", border: "2px solid #000", borderRadius: "12px", backgroundColor: "#fff", color: "#000" };
const flexSpace: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" };
const dateTitle: React.CSSProperties = { fontSize: "18px", fontWeight: "bold" };
const statusGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", marginBottom: "12px" };
const statusTab = (active: boolean): React.CSSProperties => ({ padding: "10px 0", textAlign: "center", borderRadius: "8px", border: active ? "2px solid #007bff" : "1px solid #ccc", backgroundColor: active ? "#e7f3ff" : "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "11px" });
const timeCard: React.CSSProperties = { backgroundColor: "#f9f9f9", padding: "12px", borderRadius: "10px", marginBottom: "12px", border: "1px solid #ddd" };
const checkLabel: React.CSSProperties = { fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" };
const conditionLabel: React.CSSProperties = { ...checkLabel, marginTop: "8px", color: "#d32f2f" };
const labelTitle: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px", color: "#333" };
const textAreaStyle: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box", fontSize: "14px" };
const addVisitBtn: React.CSSProperties = { backgroundColor: "transparent", border: "none", color: "#007bff", fontWeight: "bold", fontSize: "13px", cursor: "pointer" };
const visitListArea: React.CSSProperties = { border: "1px dashed #ccc", borderRadius: "8px", padding: "10px", backgroundColor: "#fff" };
// const statusBadge = (s: string): React.CSSProperties => ({ fontSize: "10px", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold", backgroundColor: s === "draft" ? "#666" : "#007bff", color: "#fff" });


const statusBadge = (s: string): React.CSSProperties => ({
  fontSize: "10px",
  padding: "2px 8px",
  borderRadius: "12px",
  fontWeight: "bold",
  // submitted の時は緑、それ以外（draft）はグレーにする
  backgroundColor: s === "submitted" ? "#28a745" : "#666", 
  color: "#fff",
  textTransform: "uppercase"
});