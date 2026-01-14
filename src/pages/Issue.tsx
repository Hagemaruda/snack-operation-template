import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Issue() {
  const [uid, setUid] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        // すでにIDがあるなら Home に戻す
        navigate("/Home", { replace: true });
      } else {
        // まだログインしていなければ、ここでだけ匿名ログインする
        await signInAnonymously(auth);
      }
    });

    return () => unsub();
  }, [navigate]);

    const handleLoginExisting = async () => {
        // ここに「既存アカウントでログイン」処理を書く
        // 例：
        // - モーダルを開く
        // - ID + パスワード入力画面に遷移
        // - signInWithEmailAndPassword(...)
        console.log("既存アカウントでログイン");
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>IDを発行しました</h1>

            {uid ? (
                <div
                    style={{
                    margin: "16px 0",
                    padding: "12px 16px",
                    border: "1px solid #ccc",
                    fontFamily: "monospace",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    }}
                >
                    <span style={{ flex: 1 }}>{uid}</span>

                    <button
                    onClick={async () => {
                        await navigator.clipboard.writeText(uid);
        // TODO: 本番では alert は使わず、
        //       独自モーダルに置き換えて URL 表示をなくす
                        alert("IDをコピーしました");
                    }}
                    style={{
                        padding: "4px 8px",
                        fontSize: 12,
                        borderRadius: 4,
                        border: "1px solid #aaa",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                    >
                    コピー
                    </button>
                </div>
            ) : (
                <p>認証情報取得中...</p>
            )}

            <p style={{ marginTop: 24, color: "#666"}}>
                すでに別のIDを使用している方はログインから継続使用できます
            </p>

            <button
              onClick={handleLoginExisting}
              style={{
                marginTop: 16,
                padding: "8px 16px",
                borderRadius: 6,
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
                別IDでログイン
            </button>
        </div>
    );
}