import { useCallback } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

export function useSafeFirestoreOperation() {
  const navigate = useNavigate();

  /**
   * Firestore 操作をラップして安全に実行
   * @param operation 実行したい async 処理
   */
  const safeRun = useCallback(async (operation: () => Promise<void>) => {
    try {
      await operation();
    } catch (e: any) {
      const user = auth.currentUser;

      // 🔹 alartLog に記録
      if (user) {
        try {
          await addDoc(collection(db, "alartLog"), {
            uid: user.uid,
            message: e.message || "Unknown error",
            url: window.location.href,
            timestamp: serverTimestamp(),
          });
        } catch (logError) {
          console.error("alartLog 書き込みエラー:", logError);
        }
      }

      // 🔹 コンソール
      console.error("Firestore 権限エラー:", e);

      // 🔹 ユーザーに通知
      alert("誤操作を検知しました");

      // 🔹 Home に誘導
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return safeRun;
}
