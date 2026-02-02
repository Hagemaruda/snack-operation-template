import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";

import type { OperationValue } from "../constants/operations";

import { LABEL } from "../constants/japan";

/*
    履歴用
*/

export const CRUD = {
    CREATE: 'C',
    REFARENCE: 'R',
    UPDATE: 'U',
    DELETE: 'D',
} as const;

export type Crud = typeof CRUD[keyof typeof CRUD];

// 役割の表示名も追加して揃える！
export const CRUD_LABEL = {
  [CRUD.CREATE]:        LABEL.HISTORY.CRUD_CREATE,
  [CRUD.REFARENCE]:     LABEL.HISTORY.CRUD_REFARENCE,
  [CRUD.UPDATE]:        LABEL.HISTORY.CRUD_UPDATE,
  [CRUD.DELETE]:        LABEL.HISTORY.CRUD_DELETE,
} as const;

interface HistoryParams {
  crud: Crud;
  operatorName: string;      // 操作した人の名前
  operation: OperationValue; // 💡 ここで補完が効きます！
  targetId?: string;         // 対象の従業員IDなど
  details?: string;          // 「時給: 1200 → 1300」などの詳細
  beforeData?: any;          // 変更前のスナップショット（任意）
  afterData?: any;           // 変更後のスナップショット（任意）
}

/**
 * 履歴（監査ログ）をFirestoreに保存する
 */
export const addHistory = async (params: HistoryParams) => {
  try {
    await addDoc(collection(db, "history"), {
      ...params,
      dateTime: serverTimestamp(),
    });
  } catch (e) {
    console.error("🔥 履歴保存エラー:", e);
    throw e;
  }
};