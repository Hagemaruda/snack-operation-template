import { FieldValue } from "firebase/firestore";
import type { OperationValue } from "../constants/operations";
import type { Crud } from "../constants/history";

export interface History {
  id?: string;
  crud: Crud;
  name: string;          // 操作した人の名前
  operation: OperationValue;
  targetId: string;      // 対象のUID
  details: string;       // "時給: 1200 → 1300" などのサマリー
  beforeData?: any;      // 💡 念のため更新前のオブジェクトを丸ごと保存してもOK
  afterData?: any;       // 💡 更新後のオブジェクト
  dateTime: FieldValue;
}