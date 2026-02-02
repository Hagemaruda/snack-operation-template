import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  where,
  limit,
  doc,
  updateDoc,
} from "firebase/firestore";
import { usePermittion } from "../hooks/usePermittion";

// メッセージの型定義
interface Message {
  id: string;
  type: "broadcast" | "system" | "report";
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt: any;
  readBy?: { [key: string]: string }; // stringに変更（名前が入るため）
}

export default function Message() {
  const { attribute } = usePermittion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  
  // ✅ ステートは必ずこの「関数の中」の冒頭に書く！
  const [showReadUsers, setShowReadUsers] = useState<string | null>(null);

  const scrollEndRef = useRef<HTMLDivElement>(null);

  // 1. リアルタイム取得
  useEffect(() => {
    if (!attribute?.uid) return;

    const messagesRef = collection(db, "messages");
    // 管理者・スタッフは全部、キャストは自分の関連分のみ
    const q = query(messagesRef, orderBy("createdAt", "asc"), limit(50));

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      
      if (attribute.role === "cast") {
        const filtered = msgs.filter(m => 
          m.type === "broadcast" || m.type === "system" || m.senderId === attribute.uid
        );
        setMessages(filtered);
      } else {
        setMessages(msgs);
      }
    });

    return () => unsub();
  }, [attribute]);

  // スクロール制御
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. 送信処理
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !attribute) return;

    const messageType = attribute.role === "admin" 
      ? (sendToAll ? "broadcast" : "report") 
      : "report";

    await addDoc(collection(db, "messages"), {
        type: messageType,
        senderId: attribute.uid,
        senderName: attribute.name || (attribute.role === "admin" ? "オーナー" : "スタッフ"),
        senderRole: attribute.role,
        content: inputText,
        createdAt: serverTimestamp(),
        readBy: { [attribute.uid]: attribute.name || "スタッフ" } // 最初から名前を入れる
    });

    setInputText("");
  };

  // 3. 既読処理（名前を保存）
  const handleRead = async (msgId: string) => {
    if (!attribute?.uid) return;
    const msgRef = doc(db, "messages", msgId);
    await updateDoc(msgRef, {
      [`readBy.${attribute.uid}`]: attribute.name || "スタッフ"
    });
  };

  const getBgColor = (msg: Message) => {
    if (msg.type === "system") return "#fff0f3";
    if (msg.type === "broadcast") return "#e3f2fd";
    if (msg.type === "report") return "#fffde7";
    return "#f5f5f5";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', padding: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', paddingRight: '5px' }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === attribute?.uid;
    // 自分が既読かどうかを判定
    const isReadByMe = msg.readBy && msg.readBy[attribute?.uid || ""];          

            // 自分以外の既読数を計算
          const readCount = msg.readBy 
            ? Object.keys(msg.readBy).filter(uid => uid !== attribute?.uid).length 
            : 0;

          return (
            <div key={msg.id} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: isMe ? 'flex-end' : 'flex-start',
              marginBottom: '15px',
              // 未読を少し強調
              transition: 'opacity 0.3s ease'
            }}>
              <span style={{ fontSize: '11px', color: '#888', marginBottom: '2px', marginLeft: '5px', marginRight: '5px' }}>
                {msg.senderName} 
                <span style={{ marginLeft: '5px', opacity: 0.7 }}>
                  ({msg.type === "broadcast" ? "全員周知" : msg.type === "system" ? "システム" : "運営相談"})
                </span>
              </span>

              <div 
                onClick={() => {
                  handleRead(msg.id); 
                  setShowReadUsers(showReadUsers === msg.id ? null : msg.id);
                }}
style={{
  backgroundColor: getBgColor(msg),
  padding: '12px 16px',
  borderRadius: isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
  maxWidth: '75%',
  cursor: 'pointer',
  position: 'relative',
  
  // 💡 既読ならさらに薄く（0.4）、未読ならクッキリ（1）
  opacity: isReadByMe ? 0.4 : 1, 
  
  // 💡 既読なら影を消して、未読なら少し浮かせる
  boxShadow: isReadByMe ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',

  // 💡 未読かつ相手からのメッセージなら、左側に目立つアクセント
  borderLeft: (!isMe && !isReadByMe) ? '5px solid #007bff' : 'none',
  
  // 既読のときは少し小さくして存在感を抑える
  transform: isReadByMe ? 'scale(0.96)' : 'scale(1)',
  transition: 'all 0.3s ease' // フワッと変わるように
}}              >
                <div style={{ fontSize: '15px', lineHeight: '1.4', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {msg.content || "(本文なし)"}
                </div>

                <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '4px', color: '#666' }}>
                  {readCount > 0 && `👀 ${readCount}`}
                  
                  {showReadUsers === msg.id && msg.readBy && (
                    <div style={{
                      position: 'absolute',
                      top: '105%',
                      right: isMe ? 0 : 'auto',
                      left: isMe ? 'auto' : 0,
                      backgroundColor: 'rgba(51, 51, 51, 0.9)',
                      color: '#fff',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      zIndex: 100,
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      pointerEvents: 'none'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px', borderBottom: '1px solid #555' }}>
                        既読メンバー
                      </div>
                        {Object.entries(msg.readBy)
                            .filter(([uid]) => uid !== attribute?.uid) // 自分のUIDじゃないものだけ残す
                            .map(([_, name]) => name)                // 名前だけ取り出す
                            .join("、 ") || "（未読）"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ borderTop: '1px solid #ddd', paddingTop: '15px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px' }}>
        {attribute?.role === "admin" && (
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input 
              type="checkbox" 
              id="sendAll"
              checked={sendToAll} 
              onChange={(e) => setSendToAll(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <label htmlFor="sendAll" style={{ fontSize: '13px', color: '#555', cursor: 'pointer', fontWeight: 'bold' }}>
              📢 全員に周知する
            </label>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="メッセージを入力..."
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '25px', 
              border: '1px solid #ddd',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            style={{ 
              padding: '0 20px', 
              backgroundColor: inputText.trim() ? '#007bff' : '#ccc', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}