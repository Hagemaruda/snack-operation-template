import { FieldValue, serverTimestamp } from "firebase/firestore";
import { SHIFT_ACTION, SHIFT_REQUEST_STATUS } from "../constants/shift";
import type { ShifRequesttStatus, ShiftAction } from "../constants/shift";

// 💡 来客情報の型
export interface Visit {
  customerName: string;
  time: string;           // HH:mm
  isGoingWith: boolean;
  memo?: string;
}

// 1. 共通項目（業務データ）
interface ShiftRequestCommon {
    uid: string;
    name: string;
    action: ShiftAction; 
    date: string;         // YYYY-MM-DD
    startTime?: string;
    endTime?: string;
    memo?: string;
    visiters: Visit[];
    status: ShifRequesttStatus;
    isClose?: boolean;
    ifTimeChangedRest: boolean,
    createdAt: FieldValue;
}

// 2. 画面用（UIの表示・入力制御に必要なフラグを含む）
export interface ShiftRequestUI extends ShiftRequestCommon {
    isLoading: boolean; 
    isOpen: boolean;
    isLast: boolean;
    changed: boolean,
}

// 3. Firestore用（保存・取得される実データ）
export interface ShiftRequestDoc extends ShiftRequestCommon {
    updatedAt: FieldValue;
}

/**
 * 初期データ
 */
export const createDefaultUIShiftRequest = (
  uid: string, 
  name: string, 
  date: string
): ShiftRequestUI => {
  const DEFAULT_START = import.meta.env.VITE_DEFAULT_START_TIME || "21:00";
  const DEFAULT_END = import.meta.env.VITE_DEFAULT_END_TIME || "05:00";
  const action = SHIFT_ACTION.WORK;
  const startTime = DEFAULT_START;
  const endTime = DEFAULT_END;
  const memo = "";
  const visiters = [] as Visit[];
  const status = SHIFT_REQUEST_STATUS.DRAFT;
  const ifTimeChangedRest = false;
  const isClose = undefined;

  const isLoading = false;
  const isOpen = true;
  const isLast = true;
  const changed = true;
  const createdAt = serverTimestamp();

  return { 
    uid, name, date, action, startTime, endTime, memo, visiters, status, isClose,
    isLoading, isOpen, isLast, ifTimeChangedRest, changed, createdAt
  };
};

/**
 * Doc (Firestore) -> UI (画面) 変換
 * DBから取得したデータに UI制御用の初期フラグを付与する
 */
export const mapDocToUIShiftRequest = (doc: ShiftRequestDoc): ShiftRequestUI => {

  const isLoading = false;
  const isOpen = !Boolean(doc.startTime);
  const isLast = !Boolean(doc.endTime);
  const changed = false;
  return {
    ...doc,
    isLoading, isOpen, isLast, changed
  };
};

/**
 * UI (画面) -> Doc (Firestore) 変換
 * 保存前に UI制御用のフラグを除去し、Firestore の構造に整える
 */
export const mapUIToDocShiftRequest = (ui: ShiftRequestUI): ShiftRequestDoc => {
  // UI専用の項目を除外して抽出
  const updatedAt = serverTimestamp();
  const { 
    isLoading,
    isOpen, 
    isLast, 
    changed, 
    ...docData
  } = ui;
  
  return { ...docData, updatedAt };
};