import React from "react";
import { ROLES, ROLE_LABELS, type Role } from "../constants/roles";
import { type EmployeeView } from "../types/employee";

/**
 * プロパティの定義
 * 編集画面(Edit)でも登録画面(Regist)でも使えるよう、
 * 「現在の値」と「変更があった時の通知」を外部から受け取ります。
 */
interface EmployeeEditViewProps {
  data: EmployeeView;
  onChange: <K extends keyof EmployeeView>(key: K, value: EmployeeView[K]) => void;
  // 編集不可にするかどうかの制御（IDなどは登録後は変えられない運用にするため）
  isUidFixed?: boolean;
}

export const EmployeeEditView: React.FC<EmployeeEditViewProps> = ({
  data,
  onChange,
  isUidFixed = false,
}) => {
  return (
    <div style={formContainer}>
      {/* --- セクション1: 基本情報 --- */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>基本プロフィール</h2>

        {/* UID入力 */}
        <div style={formGroup}>
          <label style={labelStyle}>1. 従業員のUID</label>
          <input
            style={{ ...inputStyle, backgroundColor: isUidFixed ? "#f0f0f0" : "#fff" }}
            placeholder="FirebaseのUIDを貼り付け"
            value={data.uid}
            disabled={isUidFixed}
            onChange={(e) => onChange("uid", e.target.value)}
          />
        </div>

        {/* 名前入力 */}
        <div style={formGroup}>
          <label style={labelStyle}>2. 名前（表示名）</label>
          <input
            style={inputStyle}
            placeholder="例：たろう"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        {/* 権限選択（ラジオボタン） */}
        <div style={formGroup}>
          <label style={labelStyle}>3. システム権限</label>
          <div style={roleGrid}>
            {Object.entries(ROLE_LABELS)
              .filter(([key]) => key !== ROLES.USER) // USER(未使用)は除外
              .map(([key, label]) => {
                const isActive = data.role === key;
                return (
                  <label key={key} style={roleTab(isActive)}>
                    <input
                      type="radio"
                      style={{ display: "none" }}
                      checked={isActive}
                      onChange={() => onChange("role", key as Role)}
                    />
                    {label}
                  </label>
                );
              })}
          </div>
        </div>
      </div>

      {/* --- セクション2: 給与設定 (スパイラルで次サイクルに実装) --- */}
      <div style={{ ...sectionStyle, opacity: 0.6, borderStyle: "dashed" }}>
        <h2 style={sectionTitleStyle}>給与情報（次フェーズ）</h2>
        <p style={{ fontSize: "14px", color: "#666" }}>
          ※ 現在は基本情報の登録のみ可能です。
        </p>
      </div>
    </div>
  );
};

// --- スタイル定義 (プロトの良さを活かしたバキバキ仕様) ---
const formContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const sectionStyle: React.CSSProperties = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  backgroundColor: "#fff",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  marginBottom: "16px",
  borderLeft: "4px solid #007bff",
  paddingLeft: "12px",
};

const formGroup: React.CSSProperties = { marginBottom: "20px" };

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "2px solid #333",
  fontSize: "16px",
  boxSizing: "border-box",
};

const roleGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
  gap: "8px",
};

const roleTab = (active: boolean): React.CSSProperties => ({
  padding: "12px 8px",
  textAlign: "center",
  borderRadius: "8px",
  border: active ? "3px solid #007bff" : "2px solid #ccc",
  backgroundColor: active ? "#e7f3ff" : "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
});