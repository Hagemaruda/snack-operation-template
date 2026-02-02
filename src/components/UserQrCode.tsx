// components/UserQrCode.tsx
import QRCode from "react-qr-code";
import { DISPLAY } from "../constants/japan";

interface Props {
  requestUrl: string;
}

export default function UserQrCode({ requestUrl }: Props) {
  // ここに来る時点で表示は確定しているので、条件分岐（showQR &&）は不要
  return (
    <div style={qrContainer}>
      <QRCode value={requestUrl} size={160} />
      
      <p style={messageStyle}>
        {DISPLAY.ISSUE.QR_MESSAGE}
      </p>
    </div>
  );
}

const qrContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  // すでに外枠（qrBoxStyle）があるので、ここでは余計な余白や枠を削ぎ落とす
};

const messageStyle: React.CSSProperties = {
  marginTop: "12px",
  fontSize: "14px",
  color: "#333",
  fontWeight: "bold",
  lineHeight: "1.4",
};