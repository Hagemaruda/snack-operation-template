import React, { useState } from "react";
import { format, addDays, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

interface CopyWeekModalProps {
  baseDate: string; // "2026-01-15" 形式
  isOpen: boolean;
  onClose: () => void;
  onExecute: (selectedDates: string[]) => void;
}

export default function CopyWeekModal({ baseDate, isOpen, onClose, onExecute }: CopyWeekModalProps) {
  // 翌日から7日間をリストアップ
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(parseISO(baseDate), i + 1);
    return format(date, "yyyy-MM-dd");
  });

  const [selectedDates, setSelectedDates] = useState<string[]>(next7Days);

  if (!isOpen) return null;

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleExecute = () => {
    if (selectedDates.length === 0) {
      alert("コピー先の日付を1つ以上選択してください");
      return;
    }
    const confirmMsg = `${baseDate} の内容を\n${selectedDates.length}日分にコピーします。\nよろしいですか？`;
    if (window.confirm(confirmMsg)) {
      onExecute(selectedDates);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalCard}>
        <h3 style={titleStyle}>1週間分コピー</h3>
        <p style={subTextStyle}>
          {baseDate} の設定（来店情報以外）を以下の日付にコピーします。
        </p>

        <div style={listContainer}>
          {next7Days.map((date) => {
            const isSelected = selectedDates.includes(date);
            const dateObj = parseISO(date);
            const dayName = format(dateObj, "E", { locale: ja });

            return (
              <label key={date} style={rowStyle(isSelected)}>
                <div style={flexCenter}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDate(date)}
                    style={checkboxStyle}
                  />
                  <span style={dateTextStyle}>
                    {format(dateObj, "MM / dd")} ({dayName})
                  </span>
                </div>
                {isSelected && <span style={badgeStyle}>コピー対象</span>}
              </label>
            );
          })}
        </div>

        <div style={footerStyle}>
          <button onClick={onClose} style={cancelBtn}>
            キャンセル
          </button>
          <button onClick={handleExecute} style={executeBtn}>
            [ 実行 ]
          </button>
        </div>
      </div>
    </div>
  );
}

// --- スタイル定義（インデント2） ---
const overlayStyle: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center",
  alignItems: "center", zIndex: 2000, padding: "20px", boxSizing: "border-box"
};

const modalCard: React.CSSProperties = {
  backgroundColor: "#fff", width: "100%", maxWidth: "400px",
  borderRadius: "16px", border: "3px solid #000", padding: "24px",
  boxShadow: "0 10px 0 #000", position: "relative"
};

const titleStyle = { fontSize: "20px", fontWeight: "bold", marginBottom: "8px" };
const subTextStyle = { fontSize: "13px", color: "#666", marginBottom: "20px", lineHeight: "1.4" };

const listContainer = {
  maxHeight: "350px", overflowY: "auto" as const, marginBottom: "24px",
  border: "2px solid #eee", borderRadius: "8px", padding: "8px"
};

const rowStyle = (active: boolean): React.CSSProperties => ({
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "12px", marginBottom: "8px", borderRadius: "8px", cursor: "pointer",
  border: active ? "2px solid #007bff" : "2px solid #eee",
  backgroundColor: active ? "#e7f3ff" : "#fff",
  transition: "all 0.1s ease"
});

const flexCenter = { display: "flex", alignItems: "center", gap: "12px" };
const checkboxStyle = { width: "20px", height: "20px", cursor: "pointer" };
const dateTextStyle = { fontSize: "16px", fontWeight: "bold" };
const badgeStyle = { fontSize: "10px", backgroundColor: "#007bff", color: "#fff", padding: "2px 6px", borderRadius: "4px" };

const footerStyle = { display: "flex", gap: "12px" };

const cancelBtn: React.CSSProperties = {
  flex: 1, padding: "14px", backgroundColor: "#eee", border: "2px solid #ccc",
  borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
};

const executeBtn: React.CSSProperties = {
  flex: 2, padding: "14px", backgroundColor: "#000", color: "#fff",
  border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer"
};