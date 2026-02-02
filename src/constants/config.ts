/**
 *  環境変数（個別設定）
 */
import { CONST_STRING } from "./stringConstant";

export const SHOP_CONFIG = {
  /**
   *  店名
   */
  NAME: import.meta.env.VITE_SHOP_NAME || CONST_STRING.SHOP_NAME_NOTHING,
  /**
   *  店舗営業日切り替え時刻（HH:MM：指定なしの場合は実日）
   */
  BUISINESSDATE_CHANGE_TIME: import.meta.env.VITE_BUISINESSDATE_CHANGE_TIME,
  /**
   *  シフト申請を作成する際の出勤時刻デフォルト表示時刻
   *  開店時間あたりを指定する：HH:MM）
   */
  SHIFT_VIEW_START_TIME_DEFAULt: import.meta.env.VITE_SHIFT_VIEW_START_TIME_DEFAULT,
  /**
   *  シフト申請を作成する際の退勤時刻デフォルト表示時刻
   *  閉店時間あたりを指定する：HH:MM）
   */
  SHIFT_VIEW_FINISH_TIME_DEFAULT: import.meta.env.VITE_SHIFT_VIEW_FINISH_TIME_DEFAULT,
  /**
   *  シフト申請の申請可能時刻の最小
   *  指定なしの場合は営業日切り替え時刻
   */
  SHIFT_VIEW_MIN_TIME: import.meta.env.VITE_SHIFT_VIEW_MIN_TIME,
  /**
   *  シフト申請の申請可能時刻の最大
   *  指定なしの場合は営業日切り替え時刻
   */
  SHIFT_VIEW_MAX_TIME: import.meta.env.VITE_SHIFT_VIEW_MAX_TIME,
} as const;