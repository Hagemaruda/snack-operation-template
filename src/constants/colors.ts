/**
 *  カレンダー色定義
 */
export const SCHEDULE_COLORS = {
  /**
   *  当日の背景色
   */
  BG_TODAY: '#e6f7ff',      // 水色
  /**
   *  過去日付の背景色
   */
  BG_PAST: '#f5f5f5',       // グレー
  /**
   *  シフト予定提出対象の日の背景色
   */
  BG_CONFIRMED: '#fff0f6',   // ピンク
  /**
   *  標準標準色
   */
  BG_DEFAULT: '#ffffff',
  /**
   *  日曜日の数字色
   */
  TEXT_SUNDAY: '#ff4d4f',    // 赤
  /**
   *  ぢ曜日の数字色
   */
  TEXT_SATURDAY: '#1890ff',  // 青
  /**
   *  標準色
   */
  TEXT_DEFAULT: '#333333',
  /**
   *  選択された日の枠線色（カレンダー形式）
   */
  BORDER_SELECTED_CAL: '#ff4d4f', // カレンダーは赤枠
  /**
   *  選択された日の枠線色（リスト形式）
   */
  BORDER_SELECTED_LIST: '#1890ff', // リストは青枠
} as const;