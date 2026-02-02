import type { FieldValue } from "firebase/firestore";
import type { SalaryItemType } from "../constants/salary";

/**
 * 給与明細の各項目
 */
export interface SalaryDetail {
  name: SalaryItemType | string; // 定数以外も柔軟に受け入れ
  unitPrice: number; // 単価（時給単価やバック単価）
  quantity: number;  // 数量（勤務時間 5.5 や 個数など）
  subtotal: number;  // 小計（単価 × 数量。控除ならマイナス値）
}

/**
 * 支払い・受け取り記録
 * 分割払いに対応するため配列で保持する
 */
export interface PaidInf {
  date: string;           // 支払日 (YYYY-MM-DD)
  amount: number;         // 支払った金額
  isReceived: boolean;    // スタッフが「受け取りボタン」を押したか
  receivedUid: string;    // ボタンを押した人の {uid}
  receivedAt: FieldValue; // ボタンを押した日時
}

/**
 * その日の給与実績（Firestore 1ドキュメント）
 * パス例: /salary/{date}/items/{uid}  （※後述の注意点参照）
 */
export interface Salary {
  id?: string;            // ドキュメントID
  uid: string;            // スタッフの {uid}
  name: string;           // スタッフ名（表示用）
  date: string;           // 該当日 (YYYY-MM-DD)

  // 勤怠(attendance)からの冗長データ
  checkIn: string;        // 出勤時刻 (HH:mm)
  checkOut: string;       // 退勤時刻 (HH:mm)
  workHour: number;       // 実労働時間（5.5 などの数値）

  // 給与計算の核
  details: SalaryDetail[]; // 明細配列（時給・バック・控除）
  slipIDs: string[];      // 紐づく伝票IDのリスト
  amount: number;         // その日の最終的な総支給額 (detailsの合計)

  // 支払い管理
  paidInf: PaidInf[];     // 支払い・受領履歴の配列

  createdAt: FieldValue;
  updatedAt: FieldValue;
}