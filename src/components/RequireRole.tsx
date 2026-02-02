import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePermittionContext } from "../context/PermittionContext";
import type { Role } from "../constants/roles";

export default function RequireRole({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
}) {
  const { permittion: attribute } = usePermittionContext();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. まだデータがロードされていない場合は何もしない
    if (!attribute) return;

    // 2. 有効フラグがオフならホームへ（RouteConfig側でもガードしてるけど念のため）
    if (!attribute.enable) {
      alert("システム使用権限がありません");
      navigate("/issue", { replace: true });
      return;
    }

    // 3. 権限（ロール）チェック
    if (!allowedRoles.includes(attribute.role)) {
      console.error("権限不足:", attribute.role);
      alert("この画面を開く権限がありません");
      navigate("/home", { replace: true });
    }
  }, [attribute, allowedRoles, navigate]);

  // 判定中や権限不足の間は何も表示しない（チラつき防止）
  if (!attribute || !attribute.enable || !allowedRoles.includes(attribute.role)) {
    return null; 
  }

  return <>{children}</>;
}