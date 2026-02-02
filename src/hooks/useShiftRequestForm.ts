import { useState } from "react";
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { mapUIToDoc, type ShiftRequestUI } from "../types/shiftRequest";



//import { mapUIToDoc } from "../types/shiftRequest";
//import type { ShiftRequestUI } from "../types/shiftRequest";



export const useShiftRequestForm = (uid: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const processBatch = async (
    requestsMap: Record<string, ShiftRequestUI>, 
    targetDates: string[], 
    status: 'draft' | 'submitted' | 'delay'
  ) => {
    if (!uid || targetDates.length === 0) return;
    setIsSubmitting(true);
    const batch = writeBatch(db);

    try {
      targetDates.forEach((dateStr) => {
        const uiData = requestsMap[dateStr];
        if (!uiData) return;

        // UI専用フラグを除去
        const docData = mapUIToDoc(uiData);
        const ref = doc(db, "shifts", dateStr, "request", uid);

        // 💡 id が存在しない ＝ Firestoreにまだデータがない「新規作成」
        const isNew = !uiData.id;

        batch.set(ref, {
          ...docData,
          uid,
          status: status,
          updatedAt: serverTimestamp(),
          // 💡 新規作成時のみ createdAt をセット。既存なら触らない（merge: trueにより保持）
          ...(isNew ? { createdAt: serverTimestamp() } : {}),
          // 💡 提出時のみ submittedAt をセット
          ...(status !== 'draft' ? { submittedAt: serverTimestamp() } : {})
        }, { merge: true });
      });

      await batch.commit();
    } catch (e) {
      console.error("Batch Process Error:", e);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const bulkSave = (requestsMap: Record<string, ShiftRequestUI>, targetDates: string[]) => 
    processBatch(requestsMap, targetDates, 'draft');

  const submitWeek = (requestsMap: Record<string, ShiftRequestUI>, targetDates: string[], isClosing: boolean) => 
    processBatch(requestsMap, targetDates, isClosing ? 'delay' : 'submitted');

  return { bulkSave, submitWeek, isSubmitting };
};