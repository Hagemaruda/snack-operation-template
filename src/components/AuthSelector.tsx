import { useState } from "react";
import { useAuthActions } from "../hooks/useAuthActions";
import { DISPLAY } from "../constants/japan";

export default function AuthSelector() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false); // 💡 アコーディオンの開閉状態
  const { handleGoogleAuth, requestEmailAuth, loading } = useAuthActions();

  return (
    <div style={sectionBox}>
      {/* アコーディオンのヘッダー（タイトル部分） */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ ...accordionHeader, cursor: 'pointer' }}
      >
        <span style={sectionTitleStyle}>
          {isOpen ? DISPLAY.AUTH.ICON_AUTH_OPEN : DISPLAY.AUTH.ICON_AUTH_CLOSE} {isOpen ? DISPLAY.AUTH.LABEL_AUTH_SELECT : DISPLAY.AUTH.LABEL_AUTH_PROVIDER}
        </span>
      </div>  
      
      {/* 展開される中身 */}
      {isOpen && (
        <div style={{ marginTop: "16px" }}>
          <input 
            style={inputStyle}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="メールアドレス"
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              style={primaryBtnStyle}
              onClick={() => requestEmailAuth(email)} 
              disabled={loading}
            >
              {DISPLAY.AUTH.BUTTON_MAIL_AUTH}
            </button>

            <button 
              style={googleBtnStyle}
              onClick={handleGoogleAuth} 
              disabled={loading}
            >
              {DISPLAY.AUTH.BUTTON_GOOGLE_AUTH}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- スタイル定義 ---

const sectionBox: React.CSSProperties = {
  padding: "16px",
  border: "2px solid #eee",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fff",
  marginTop: "20px"
};

const accordionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "4px 0"
};

const sectionTitleStyle = { 
  fontSize: "16px", 
  color: "#333", 
  fontWeight: "bold" as const 
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

const primaryBtnStyle = {
  width: "100%", 
  padding: "16px", 
  backgroundColor: "#007bff", 
  color: "#fff",
  border: "none", 
  borderRadius: "12px", 
  fontSize: "16px", 
  fontWeight: "bold" as const, 
  cursor: "pointer"
};

const googleBtnStyle = {
  width: "100%", 
  padding: "16px", 
  backgroundColor: "#fff", 
  color: "#000",
  border: "2px solid #333", 
  borderRadius: "12px", 
  fontSize: "16px", 
  fontWeight: "bold" as const, 
  cursor: "pointer"
};