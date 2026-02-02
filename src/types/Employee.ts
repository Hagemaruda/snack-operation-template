/**
 *  従業員（個人）に関する情報
 */
import { FieldValue, Timestamp } from "firebase/firestore";
import type { Role } from "../constants/roles";
import { CONST_STRING } from "../constants/stringConstant";

/**
 *  社員情報業務利用データ部
 *  uidはDoc.Idなのでフォールドに持たない
 */
export interface EmployeeDoc {
  /**
   *  名前（表示名）
   */
  name: string;
  /**
   *  権限
   */
  role: Role;
  /**
   *  システム利用可否
   */
  enable: boolean;
  /**
   *  商品の個別バックが設定されている場合の情報
   *    stringは商品コード
   *    numberはバック金額
   */
  customBacks?: Record<string, number>;
}

/**
 *  データ書き込み用
 */
export interface EmployeeDocWrite extends EmployeeDoc {
  createdBy: string;
  createdAt: FieldValue;
  updatedBy?: string;
  updatedAt?: FieldValue;
}

/**
 *  データ読み込み用
 */
export interface EmployeeDocRead extends EmployeeDoc {
  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}

/**
 *  画面用
 */

/**
 *  給与の各項目の許される組み合わせを定義する
 *    (1) 給与情報なし：hourly, startDate, endDate 共に存在なし（undefined）
 *    (2) 現在使用中の給与情報：hourly: number, startDate: string　endDate: undefine
 *    (3) 適用終了日が決まった給与：　hourly: number, startDate: string, endDate: string
 *    kind で 状態を判別できる
 *      (1) = WAGE_KIND.NONE
 *      (2) = WAGE_KIND.ACTIVE
 *      (3) = WAGE_KIND.CLSED
 */

/**
 *    1.値の定義
 *      型定義の元になる文字列（literal型の識別子として使う）の定義
 *      （ as const により　literal 型として扱われる）
 */
export const WAGE_KIND = {
  NONE: CONST_STRING.WAGE_KIND.NONE,
  ACTIVE: CONST_STRING.WAGE_KIND.ACTIVE,
  CLOSED: CONST_STRING.WAGE_KIND.CLOSED,
} as const;

/**
 *    2.型の定義
 *      WAGE_KIND の Value（文字列）を Union にした型を成形（Valueを抽出）して型宣言
 *      （ 'none’ | 'active' | 'ended' ）
 */
export type WageKind = typeof WAGE_KIND[keyof typeof WAGE_KIND];

/**
 *    3.組み合わせの定義
 *      kind に それぞれ文字列を設定して、Union で 型の構成を制限している
 *      （wage の 項目の組み合わせのパターンを union 型とすることで、この組み合わせしか許さない）
 */
export type WageViewPattern =
  /**
   *  給与情報なし
   */
  | { kind: typeof WAGE_KIND.NONE }
  /**
   *  使用中の給与情報
   */
  | { kind: typeof WAGE_KIND.ACTIVE; hourly: number; startDate: string }
  /**
   *  過去の情報
   */
  | { kind: typeof WAGE_KIND.CLOSED; hourly: number; startDate: string; endDate: string }

export interface EmployeeView extends EmployeeDoc {
  /**
   *  データのドキュメントIDから設定
   *  登録時は社員から依頼されたID（FirebaseAuthのID）
   */
  uid: string;
  /**
   *  給与情報はWageサブコレクションから取得
   * （ACTIVE : endDateがない給与情報を使用）
   *  Viewから値が設定される場合も WageViewPattern で組み合わせを制限している
   */
  wage: WageViewPattern;
  /**
   *  WageAmountサブコレクションを画面用に展開して所持
   */
  append?: WageAppend[];
  customBacks?: Record<string, number>;
}

/**
 *  社員情報更新履歴
 */
export interface EmployeeDocHistory extends EmployeeDoc {
  /**
   *  誰のデータが変わったかのID
   */
  uid: string;
  /**
   *  更新メモ
   */
  memo: string;
  /**
   *  更新前情報
   */
  before?: EmployeeDoc;
  /**
   *  更新後情報
   */
  after: EmployeeDoc;
}

/**
 *  履歴は積み重ねなので、updatedBy,updatedAtは持たない
 *  社員情報履歴書き込み用
 */
export interface EmployeeDocHistoryWrite extends EmployeeDocHistory {
  createdBy: string;
  createdAt: FieldValue;
}

/**
 *  社員情報履歴読み込み用
 */
export interface EmployeeDocHistoryRead extends EmployeeDocHistory {
  createdBy: string;
  createdAt: Timestamp;
}


/**
 *  時給情報
 *    運用
 *      設定（初期）
 *        startDateが入る
 *        createdBy,createdAtが設定される
 *          上記でドキュメントを作成
 *      変更時：今の給与に終了日を設定⇨新しい適用日のドキュメントを格納
 *        endDateが入る
 *        updatedBy,updatedAtが設定される
 *          上記でドキュメントを更新
 *        startDateが入る
 *        createdBy,createdAtが設定される
 *          上記でドキュメントを作成
 * 　　上記の運用のため、全情報＝履歴となる
 */
export interface WageCollection {
  /**
   *  時給
   */
  hourly: number;
  /**
   *  時給の適用開始日（YYYY-MM-DD）
   */
  startDate: string;
  /**
   *  時給の適用終了日（YYYY-MM-DD）
   */
  endDate?: string;
};

/**
 *  給与情報書き込み用
 */
export interface WageDocWrite extends WageCollection {
  createdBy: string;
  createdAt: FieldValue;
  updatedBy?: string;
  updatedAt?: FieldValue;
}

/**
 *  給与情報読み込み用
 */
export interface WageDocRead extends WageCollection {
  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}


/**
 *  追加支払い情報（交通費など）
 *  業務利用部分（Firestore/画面の共用部分）
 */
export interface WageAppend {
  /**
   *  適用（給与明細に記載される文言
   */
  apply: string;
  /**
   *  支払額
   */
  amountPay: number;
  /**
   *  支払い条件がある場合の条件
   */
  terms?: string;
}

/**
 *  コレクションまでの部分
 */
export interface WageAppendCollection extends WageAppend {
  /**
   *  適用開始日
   */
  startDate: string;
  /**
   *  適用終了日
   */
  endDate?: string;
}

/**
 *  データ書き込み用
 */
export interface WageAppendDocWrite extends WageAppendCollection {
  createdBy: string;
  createdAt: FieldValue;
  updatedBy?: string;
  updatedAt?: FieldValue;
}

/**
 *  データ読み込み用
 */
export interface WageAppendDocRead extends WageAppendCollection {
  createdBy: string;
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt?: Timestamp;
}
