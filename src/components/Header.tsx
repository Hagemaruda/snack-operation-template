import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "../constants/menuItems";
import { logout } from "../services/authActions";
import { SHOP_CONFIG } from "../constants/config";
import { usePermittionContext } from "../context/PermittionContext";
import { useTodayStatusContext } from "../context/TodayStatusContext";
import { TODAY_STATUS, TODAY_STATUS_COLOR, TODAY_STATUS_LABELS } from "../services/todayStatus";

export default function Header() {
  const { permittion: attribute } = usePermittionContext();
  const { todayStatus } = useTodayStatusContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const visibleMenu = MENU_ITEMS.filter(item => 
    attribute?.role && item.roles.includes(attribute.role as any)
  );

  const status = todayStatus || TODAY_STATUS.REST;
  const uiColor = TODAY_STATUS_COLOR[status];
  const label = TODAY_STATUS_LABELS[status];

  return (
    <header style={headerStyle}>

      {/* 💡 メニューが開いている時だけ、画面全体を覆う透明な板を表示 */}
      {isOpen && (
        <div 
          style={overlayStyle} 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* 左：メニュー */}
      <div style={leftSection}>
        <button onClick={() => setIsOpen(!isOpen)} style={menuBtnStyle}>
          {isOpen ? "✕" : "☰"}
        </button>
        <span style={nameStyle}>{SHOP_CONFIG.NAME}</span>

        {/* ドロップダウンメニュー（オーバーレイより上に表示されるよう z-index を調整） */}
        {isOpen && (
          <div style={dropdownStyle}>
            {/* メニューの中身 */}
            {visibleMenu.map((item) => (
              <div key={item.path} style={menuItemStyle} onClick={() => { navigate(item.path); setIsOpen(false); }}>
                {item.label}
              </div>
            ))}
            <div style={logoutItemStyle} onClick={() => { setIsOpen(false); logout(); }}>ログオフ</div>
          </div>
        )}
      </div>

      <div style={centerSection}>
        {/* 💡 色と文字だけのシンプルな表示 */}
        <div style={{ ...statusTextStyle, backgroundColor: uiColor.bg , color: uiColor.text }}>
          { label }
        </div>
      </div>

      <div style={rightSection}>
        {/*未設定の定数化*/}
        <span style={nameStyle}>{attribute?.name || "未設定"}</span>
      </div>
    </header>
  );
}

// --- スタイル（視認性重視） ---

const headerStyle = {
  // 💡 ここが固定のキモ！
  position: "sticky" as const,
  top: 0,
  zIndex: 1000, // 💡 他のコンテンツより必ず上に表示されるようにする

  display: "flex", 
  alignItems: "center", 
  justifyContent: "space-between",
  padding: "0 16px", 
  height: "60px", 
  backgroundColor: "#fff",
  borderBottom: "3px solid #000", // 下線を太くして境界をハッキリさせる
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // 💡 少し影をつけて「浮いている感」を出す
};

const leftSection = { position: "relative" as const, flex: 1 };
const rightSection = { flex: 1, textAlign: "right" as const };

const menuBtnStyle = {
  fontSize: "24px", background: "none", border: "none", color: "#000", cursor: "pointer", fontWeight: "bold"
};

/*
const dropdownStyle = {
  position: "absolute" as const, top: "50px", left: "0", backgroundColor: "#fff",
  border: "2px solid #000", width: "200px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};
*/


const menuItemStyle = {
  padding: "16px", borderBottom: "1px solid #eee", color: "#000",
  fontWeight: "bold" as const, cursor: "pointer"
};

/*
const statusBadgeStyle = {
  backgroundColor: "#000", color: "#fff", padding: "4px 12px",
  borderRadius: "20px", fontSize: "12px", fontWeight: "bold" as const
};
*/

const nameStyle = { fontSize: "14px", color: "#000", fontWeight: "bold" as const };

const logoutItemStyle = {
  ...menuItemStyle, // 基本スタイルを継承
  color: "#d32f2f", // 濃い赤
  borderTop: "2px solid #eee", // 上に少し太めの区切り線
  borderBottom: "none",
};

/*
const centerSection = { 
  flex: 1, 
  textAlign: "center" as const, // 💡 中のインライン要素を中央に寄せる
  lineHeight: "60px",           // 💡 ヘッダーの高さ(60px)に合わせると縦中央も安定します
};

const statusTextStyle = {
  display: "inline-block",      // 💡 文字幅に自動で合わせる
  verticalAlign: "middle",      // 💡 縦位置の微調整
  padding: "2px 14px",          // 💡 左右の余白
  fontSize: "11px",
  fontWeight: "bold" as const,
  borderRadius: "16px",         // 💡 しっかり角丸
  lineHeight: "1.6",            // 💡 バッジ内の文字の高さ
  whiteSpace: "nowrap" as const,
};
*/

// メニュー対応で追加

const overlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "transparent", // 💡 透明なので見た目は変わらない
  zIndex: 999, // 💡 ドロップダウン(1000)のすぐ下
};

const dropdownStyle = {
  position: "absolute" as const,
  top: "50px",
  left: "0",
  backgroundColor: "#fff",
  border: "2px solid #000",
  width: "200px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  zIndex: 1000, // 💡 オーバーレイより上
};

const centerSection = { 
  flex: 1, 
  textAlign: "center" as const,
  display: "flex",         // 💡 flexに戻して
  justifyContent: "center", // 💡 左右中央
  alignItems: "center",     // 💡 上下中央
};

const statusTextStyle = {
  display: "inline-block",
  padding: "2px 14px",
  fontSize: "11px",
  fontWeight: "bold" as const,
  borderRadius: "16px",
  whiteSpace: "nowrap" as const,
  lineHeight: "1.6",
  // 💡 width: "fit-content" を使わなくても inline-block なら文字幅になります
};