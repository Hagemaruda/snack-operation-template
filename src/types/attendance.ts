import { serverTimestamp } from "firebase/database";
import type { FieldValue } from "firebase/firestore";

import type { Visit } from "./shiftRequest";

// 1. 共通項目（業務データ）
interface AttendanceCommon {
    uid: string;
    name: string;
    date: string;         // YYYY-MM-DD
    requestTime?: string;
    startTime?: string;
    endTime?: string;
    visiters: Visit[];
    salary?: string;
    workInRequest?: string;
    workInApplove?: string;
    workFinish?: string;
    isCanceled?: boolean;
    createdAt: FieldValue;
}

// 2. 画面用（UIの表示・入力制御に必要なフラグを含む）
export interface AttendanceUI extends AttendanceCommon {
    isLoading: boolean; 
    isSalary: boolean;
    isChanged: boolean;
}

// 3. Firestore用（保存・取得される実データ）
export interface AttendanceDoc extends AttendanceCommon {
    updatedAt: FieldValue;
}

/**
 * Doc (Firestore) -> UI (画面) 変換
 * DBから取得したデータに UI制御用の初期フラグを付与する
 */
export const mapDocToUIAtetndance = (doc: AttendanceDoc): AttendanceUI => {

  const isLoading = false;
  const isSalary = Boolean(doc.salary);
  const isChanged = false;
  return {
    ...doc,
    isLoading, isSalary, isChanged
  } as AttendanceUI;
};

/**
 * UI (画面) -> Doc (Firestore) 変換
 * 保存前に UI制御用のフラグを除去し、Firestore の構造に整える
 */
export const mapUIToDocAttendance = (ui: AttendanceUI): AttendanceDoc => {
  // UI専用の項目を除外して抽出
  const updatedAt = serverTimestamp();
  const { 
    isLoading,
    isSalary,
    isChanged,
    ...docData 
  } = ui;
  
  return { ...docData, updatedAt } as AttendanceDoc;
};