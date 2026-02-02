import { FieldValue, serverTimestamp } from "firebase/firestore";
import type { ShiftAction } from "../constants/shift";
import type { ShiftRequestDoc, Visit } from "./shiftRequest";

// 1. 共通項目（業務データ）
interface ShiftScheduleCommon {
    uid: string;
    name: string;
    action: ShiftAction; 
    date: string;         // YYYY-MM-DD
    startTime?: string;
    changedStartTime?: string;
    endTime?: string;
    changedEndTime?: string;
    visiters: Visit[];
    isCanceled?: boolean;
    createdAt: FieldValue;
}

// 2. 画面用（UIの表示・入力制御に必要なフラグを含む）
export interface ShiftScheduleUI extends ShiftScheduleCommon {
    isLoading: boolean;
    changed: boolean;
}

// 3. Firestore用（保存・取得される実データ）
export interface ShiftScheduleDoc extends ShiftScheduleCommon {
    updatedAt: FieldValue;
}

/**
 * 初期データ
 */
export const createDefaultUIShiftSchedule = ( request: ShiftRequestDoc ): ShiftScheduleUI => {
    const toSchedule = { ...request };
    const createdAt = serverTimestamp();
    const isLoading = false;
    const changed = false;
    return { ...toSchedule, createdAt, isLoading, changed }
};

/**
 * Doc (Firestore) -> UI (画面) 変換
 * DBから取得したデータに UI制御用の初期フラグを付与する
 */
export const mapDocToUIShiftSchedule = (doc: ShiftScheduleDoc): ShiftScheduleUI => {

  const isLoading = false;
  const changed = false;
  return {
    ...doc,
    isLoading, changed
  };
};

/**
 * UI (画面) -> Doc (Firestore) 変換
 * 保存前に UI制御用のフラグを除去し、Firestore の構造に整える
 */
export const mapUIToDocShiftRequest = (ui: ShiftScheduleUI): ShiftScheduleDoc => {
  // UI専用の項目を除外して抽出
  const updatedAt = serverTimestamp();
  const { 
    isLoading,
    changed, 
    ...docData
  } = ui;
  
  return { ...docData, updatedAt };
};