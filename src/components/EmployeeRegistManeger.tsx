import React from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeEditView } from "./EmployeeEditView";
import { useEmployeeEdit } from "../hooks/useEmployeeEdit";
import { ROLES } from "../constants/roles";
import { WAGE_KIND } from "../types/employee";
import { useEmployees } from "../hooks/useEmployees";

interface Props {
  /** Page層から渡される初期値（URLパラメータ） */
  initialUid?: string;
  initialName?: string;
}

export const EmployeesRegistManager: React.FC<Props> = ({ 
  initialUid = "", 
  initialName = "" 
}) => {
  const navigate = useNavigate();

  // 1. 画面用の状態管理（監視役）を起動
  const { formData, updateField } = useEmployeeEdit({
    uid: initialUid,
    name: initialName,
    role: ROLES.CAST,
    enable: true,
    wage: { kind: WAGE_KIND.NONE },
  });

    // 2. 機能（Firestoreアクセス・Loading状態）を起動
    const { saveEmployee, isSaving } = useEmployees();

    // 3. 登録ボタンが押された時の「戦略（シナリオ）」
    const handleRegister = async () => {
        // バリデーション（軍師の判断）
        if (!formData.uid || !formData.name) {
        alert("UIDと名前は入力必須です。");
        return;
        }

    if (formData.role === ROLES.ADMIN) {
      if (!window.confirm("【警告】全権限ユーザーとして登録しますか？")) return;
    }

    // 保存実行
    // ※operatorIdは本来AuthContext等から取りますが、今は仮置き
    const result = await saveEmployee(formData, "system_admin");

    if (result.success) {
      alert(`${formData.name} さんの登録が完了しました！`);
      
      // スパイラル次周（詳細編集）への誘導
      if (window.confirm("続けて給与などの詳細設定を行いますか？")) {
        navigate(`/employees-edit?uid=${formData.uid}`);
      } else {
        navigate("/employees-list"); 
      }
    } else {
      // 既にIDが存在する場合などのエラーハンドリング
      alert(`登録エラー: ${result.error?.message}`);
    }
  };

  return (
    <div style={managerContainer}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>新規従業員登録</h1>
        <p style={subTitleStyle}>基本情報を入力して登録を完了させてください。</p>
      </header>
      
      {/* Viewを表示。
         「データ」と「変わった時の報告窓口(updateField)」を渡すだけ。
      */}
      <EmployeeEditView 
        data={formData} 
        onChange={updateField} 
        isUidFixed={!!initialUid} 
      />

      {/* アクションエリア */}
      <div style={actionArea}>
        <button
          onClick={handleRegister}
          disabled={isSaving || !formData.uid || !formData.name}
          style={submitBtn(isSaving || !formData.uid || !formData.name)}
        >
          {isSaving ? "通信中..." : "登録"}
        </button>
        
        <button 
          onClick={() => navigate(-1)} 
          style={cancelBtn}
          disabled={isSaving}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

// --- スタイル（Managerとしてのレイアウト担当） ---
const managerContainer: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "32px",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = { fontSize: "24px", fontWeight: "bold", color: "#333" };
const subTitleStyle: React.CSSProperties = { fontSize: "14px", color: "#666", marginTop: "8px" };

const actionArea: React.CSSProperties = {
  marginTop: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const submitBtn = (disabled: boolean): React.CSSProperties => ({
  padding: "18px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: disabled ? "#ccc" : "#007bff",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : "0 4px 12px rgba(0,123,255,0.3)",
});

const cancelBtn: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "transparent",
  border: "none",
  color: "#666",
  cursor: "pointer",
  textDecoration: "underline",
};