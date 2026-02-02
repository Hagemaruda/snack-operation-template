import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { SHIFT_ACTION_LABELS } from "../constants/shift";
import type { ShiftRequestUI } from "../types/shiftRequest";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  dirtyRequests: ShiftRequestUI[];
//  onExecute: (selectedDates: string[]) => void;
    onExecute: (selectedDates: string[]) => Promise<void> | void;
}

export default function SubmitConfirmModal({
  isOpen,
  onClose,
  dirtyRequests,
  onExecute
}: SubmitConfirmModalProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(
    dirtyRequests.map(r => r.date)
  );

  if (!isOpen || dirtyRequests.length === 0) return null;

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

/*  
  const handleExecute = () => {
    if (selectedDates.length === 0) {
      alert("提出する日付を1つ以上選択してください");
      return;
    }
    const confirmMsg = `${selectedDates.length}件のシフトを提出します。よろしいですか？`;
    if (window.confirm(confirmMsg)) {
      onExecute(selectedDates);
    }
  };
*/


    // handleExecute 関数の修正
    const handleExecute = async () => { // 💡 async化
    if (selectedDates.length === 0) {
        alert("提出する日付を1つ以上選択してください");
        return;
    }
    const confirmMsg = `${selectedDates.length}件のシフトを提出します。よろしいですか？`;
    if (window.confirm(confirmMsg)) {
        await onExecute(selectedDates); // 💡 実行を待機
        // ※ 成功時にモーダルを閉じる処理は、呼び出し元の ScheduleManager 側で 
        // success 判定をもって行われるため、ここでは await するだけでOKです。
    }
    };


  const sortedRequests = [...dirtyRequests].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div style={overlayStyle}>
      <div style={modalCard}>
        <h3 style={titleStyle}>シフト一括提出の確認</h3>
        <p style={subTextStyle}>
          以下の変更（未保存分）を確定します。
        </p>

        <div style={listContainer}>
          {sortedRequests.map((req) => {
            const isSelected = selectedDates.includes(req.date);
            const dateObj = parseISO(req.date);
            const dayName = format(dateObj, "E", { locale: ja });

            return (
              <label key={req.date} style={rowStyle(isSelected)}>
                <div style={flexCenter}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDate(req.date)}
                    style={checkboxStyle}
                  />
                  <div>
                    <div style={dateTextStyle}>
                      {format(dateObj, "MM / dd")} ({dayName})
                    </div>
                    <div style={actionTextStyle}>
                      {SHIFT_ACTION_LABELS[req.action]} {req.startTime}〜{req.endTime}
                    </div>
                  </div>
                </div>
                {isSelected && <span style={badgeStyle}>提出対象</span>}
              </label>
            );
          })}
        </div>

        <div style={footerStyle}>
          <button onClick={onClose} style={cancelBtn}>
            キャンセル
          </button>
          <button onClick={handleExecute} style={executeBtn}>
            [ 提出を確定する ]
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center",
  alignItems: "center", zIndex: 2100, padding: "20px", boxSizing: "border-box"
};

const modalCard: React.CSSProperties = {
  backgroundColor: "#fff", width: "100%", maxWidth: "400px",
  borderRadius: "16px", border: "3px solid #000", padding: "24px",
  boxShadow: "0 10px 0 #000", position: "relative"
};

const titleStyle = { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" };
const subTextStyle = { fontSize: "13px", color: "#666", marginBottom: "16px", lineHeight: "1.4" };

const listContainer = {
  maxHeight: "350px", overflowY: "auto" as const, marginBottom: "20px",
  border: "2px solid #eee", borderRadius: "8px", padding: "8px"
};

const rowStyle = (active: boolean): React.CSSProperties => ({
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "10px", marginBottom: "6px", borderRadius: "8px", cursor: "pointer",
  border: active ? "2px solid #28a745" : "2px solid #eee",
  backgroundColor: active ? "#f0fff4" : "#fff",
  transition: "all 0.1s ease"
});

const flexCenter = { display: "flex", alignItems: "center", gap: "12px" };
const checkboxStyle = { width: "18px", height: "18px", cursor: "pointer" };
const dateTextStyle = { fontSize: "15px", fontWeight: "bold" };
const actionTextStyle = { fontSize: "12px", color: "#555" };
const badgeStyle = { fontSize: "10px", backgroundColor: "#28a745", color: "#fff", padding: "2px 6px", borderRadius: "4px" };

const footerStyle = { display: "flex", gap: "12px" };

const cancelBtn: React.CSSProperties = {
  flex: 1, padding: "14px", backgroundColor: "#eee", border: "2px solid #ccc",
  borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
};

const executeBtn: React.CSSProperties = {
  flex: 2, padding: "14px", backgroundColor: "#000", color: "#fff",
  border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer"
};