/*
    Issue.tsx
      システム使えない人の画面
        実際の動作はAuthActionManegerに任せる（表示モードの設定のみ）
*/
import AuthActionManeger, { AUTH_ACTION_MANEGER_VIEW_MODE } from "../components/AuthActionManeger";

export default function Issue() {

  const mode = AUTH_ACTION_MANEGER_VIEW_MODE.ISSUE;

  return (
    <div style={containerStyle}>
      <AuthActionManeger mode={mode} />
    </div>
  );
}

const containerStyle = { 
  padding: "24px", 
  maxWidth: "400px", 
  margin: "0 auto", 
  textAlign: "center" as const,
  backgroundColor: "#fff",
  minHeight: "100vh"
};
