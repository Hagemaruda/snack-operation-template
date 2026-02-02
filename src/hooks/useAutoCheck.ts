import { getDocs, query, collection, where } from "firebase/firestore";
import { createNotice } from "../services/noticeService";
import { db } from "../firebase";

export const useAutoCheck = () => {
  const checkUnsubmittedShift = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = localStorage.getItem(`last_check_${uid}`);

    // 1日に1回だけ実行して課金を節約
    if (lastCheck === today) return;

    // 【簡易判定】直近7日間に自分の submitted なドキュメントが何件あるか？
    // 本来はもっと厳密に「特定の日」を探しますが、まずは「提出が少ない」ことを検知
    const q = query(
      collection(db, "shift_requests"),
      where("uid", "==", uid),
      where("date", ">=", today),
      where("status", "==", "submitted")
    );

    const snap = await getDocs(q);
    
    // 例えば今後7日間で提出が3日未満ならリマインドを出す
    if (snap.size < 3) {
      await createNotice(uid, 'UNSUBMITTED_REMIND', '未提出のシフト希望があります。確認してください。', '/calendar');
    }

    localStorage.setItem(`last_check_${uid}`, today);
  };

  return { checkUnsubmittedShift };
};