import React from "react";
import { useSearchParams } from "react-router-dom";
import { EmployeesRegistManager } from "../components/EmployeeRegistManeger";

/**
 *  従業員登録ページ
 *  役割：URLパラメータ（?uid=xxx&name=yyy）を解析し、Managerに注入する
 */
const EmployeeRegist: React.FC = () => {
  const [searchParams] = useSearchParams();

  // URLから初期値を取得（QR読み込みやリンク連携を想定）
  const initialUid = searchParams.get("uid") || "";
  const initialName = searchParams.get("name") || "";

  return (
    <div style={pageLayout}>
      {/* ビジネスロジックとUIの制御はManagerにお任せ。
          Pageは「きっかけ（初期値）」を渡すだけ。
      */}
      <EmployeesRegistManager 
        initialUid={initialUid} 
        initialName={initialName} 
      />
    </div>
  );
};

// 画面全体の余白などを定義
const pageLayout: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
  padding: "20px 0",
};

export default EmployeeRegist;