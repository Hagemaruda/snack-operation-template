/*
    IssueIdArea: ID表示/ 共有/ QR表示（children）
*/
import { DISPLAY } from "../constants/japan";

interface Props {
  uid: string;
  name: string;
  setName: (name: string) => void;
  canShare: boolean;
  onShare: () => void;
  onCopy: () => void;
  isQrOpen: boolean;
  onToggleQr: () => void;
  children: React.ReactNode;
}

export default function IssueIdArea({ uid, name, setName, canShare, onShare, onCopy, isQrOpen, onToggleQr, children }: Props) {

return (
    <div style={actionContainerStyle}>
      {/* 1. 名前入力（位置固定） */}
      <input
        style={inputStyle}
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="店での名前を入力"
      />

      {/* 2. ID表示（位置固定） */}
      <div style={idBoxStyle}>
        <code style={codeStyle}>{uid}</code>
      </div>

      {/* 3. ボタン群 */}
      <div style={btnGroupStyle}>
        <button onClick={onCopy} style={copyBtnStyle}>
          {DISPLAY.ISSUE.BUTTON_COPY}
        </button>

        {canShare && (
          <button onClick={onShare} style={lineBtnStyle}>
            {DISPLAY.ISSUE.BUTTON_LINE}
          </button>
        )}

        <button onClick={onToggleQr} style={qrToggleBtnStyle}>
          {isQrOpen ? "QRを閉じる" : "QRで登録（管理者に提示）"}
        </button>
      </div>

      {/* 4. QR表示エリア（開いた時だけ一番下に出現） */}
      {isQrOpen && (
        <div style={qrBoxStyle}>
          {children}
        </div>
      )}      
    </div>
  );
}

const btnGroupStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  marginTop: "24px"
};

const idBoxStyle = {
  backgroundColor: "#f0f0f0",
  padding: "16px",
  borderRadius: "8px",
  border: "2px solid #333",
  marginBottom: "20px",
  textAlign: "center" as const // 💡 IDも真ん中に寄せると綺麗
};

const codeStyle = { 
  fontSize: "14px", 
  color: "#000", 
  fontWeight: "bold" as const,
  wordBreak: "break-all" as const,
  fontFamily: "monospace"
};

const lineBtnStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#06C755",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold" as const,
  fontSize: "16px",
  marginBottom: "12px",
  cursor: "pointer",
};

const copyBtnStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#fff",
  color: "#000",
  border: "2px solid #000",
  borderRadius: "12px",
  fontWeight: "bold" as const,
  fontSize: "16px",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%", 
  padding: "14px", 
  borderRadius: "8px", 
  border: "2px solid #333",
  fontSize: "16px", 
  marginBottom: "12px", 
  boxSizing: "border-box" as const
};

// モダンな配色とシャドウの定数
const THEME = {
  accent: "#007AFF",       // iOS風の鮮やかなブルー
  line: "#06C755",         // LINEブランドカラー
  bg: "#F2F2F7",           // 背景色（薄いグレー）
  card: "rgba(255, 255, 255, 0.8)", // 透過カード
  text: "#1C1C1E",         // 深い墨色
  border: "rgba(0, 0, 0, 0.05)",
};

const actionContainerStyle: React.CSSProperties = {
  maxWidth: "420px",
  margin: "24px auto",
  padding: "24px",
  backgroundColor: THEME.bg,
  borderRadius: "28px",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const qrToggleBtnStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: THEME.text, // または "#1C1C1E"
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold" as const,
  fontSize: "16px",
  cursor: "pointer",
  transition: "opacity 0.2s ease", // 押し心地を良くする
};

// 念のため、既存のqrBoxStyleも中身が見えやすいように少しだけ更新
const qrBoxStyle: React.CSSProperties = {
  marginTop: "24px",
  padding: "20px",
  backgroundColor: "#fff", // QRの背景を白くして読み取りやすく
  borderRadius: "16px",
  border: "1px solid rgba(0,0,0,0.1)",
  textAlign: "center",
};