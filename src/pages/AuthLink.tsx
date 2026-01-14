import {
  sendSignInLinkToEmail,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithCredential,
  isSignInWithEmailLink,
  getAuth,
} from "firebase/auth";
import { useState, useEffect } from "react";

export default function AuthLink() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [email, setEmail] = useState("");

  if (!user) {
    return <div style={{ padding: 24 }}>ログイン情報がありません</div>;
  }

  // メールリンクから戻ってきたときの処理
  useEffect(() => {
    const completeLink = async () => {
      if (!user) return;

      if (isSignInWithEmailLink(auth, window.location.href)) {
        const storedEmail = window.localStorage.getItem("emailForLink");
        if (!storedEmail) return;

        try {
          const cred = EmailAuthProvider.credentialWithLink(
            storedEmail,
            window.location.href
          );
          await linkWithCredential(user, cred);
          window.localStorage.removeItem("emailForLink");
          alert("メール認証を追加しました");
        } catch (e: any) {
          alert(e.message);
        }
      }
    };

    completeLink();
  }, [auth, user]);

  const linkEmail = async () => {
    try {
      if (!email) {
        alert("メールアドレスを入力してください");
        return;
      }

      const actionCodeSettings = {
        // 認証完了後に戻ってくるURL
        url: `${window.location.origin}/authLink`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForLink", email);

      alert("確認メールを送信しました。メール内のリンクを開いてください。");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const linkGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await linkWithPopup(user, provider);
      alert("Google認証を追加しました");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h2>認証方法を追加</h2>

      <section style={{ marginBottom: 32 }}>
        <h3>メールリンク認証（パスワードなし）</h3>
        <p style={{ fontSize: 14, color: "#666" }}>
          入力したメールアドレスに確認リンクを送信します。
          そのリンクを開くと、このアカウントにメール認証が追加されます。
        </p>
        <input
          style={{ width: "100%", padding: 8 }}
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={linkEmail}>確認メールを送信</button>
        </div>
      </section>

      <section>
        <h3>外部認証</h3>
        <button onClick={linkGoogle}>Google を追加</button>
        <br />
      </section>
    </div>
  );
}
