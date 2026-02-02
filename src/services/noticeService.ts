import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export type NoticeType = 'SHIFT_FINALIZED' | 'UNSUBMITTED_REMIND' | 'DELAY_SUBMITTED' | 'MESSAGE';

export const createNotice = async (uid: string, type: NoticeType, title: string, link: string = "") => {
  try {
    await addDoc(collection(db, "userNotices"), {
      uid,
      type,
      title,
      link,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error adding notice: ", e);
  }
};