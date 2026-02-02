/**
 *  トースト用事用
 */
import { AuthErrorCodes } from "firebase/auth";
import { DISPLAY } from "./japan";
import { MY_NOTICE_LEVEL, type NoticePreset } from "../types/myToast";

/**
 *  トースト表示用マップ
 *  message:　表示メッセージ
 *  level:　表示レベル
 *  @see MyNoticeLevel
 *  opts:　トースト表示オプション
 *      icon: アイコンを指定
 *      duration:　表示時間（ms）
 *      stype:　表示スタイル
 *  @see ToastOptions
 */
export const NOTICE_MAP: Record<string, NoticePreset> = {
  [AuthErrorCodes.INVALID_EMAIL]:
    {
        message:    DISPLAY.AUTH.ERROR_INVALID_EMAIL,
        level:      MY_NOTICE_LEVEL.NORMAL,
        opts:   {
            style: {
                color: 'white',
                background: 'red',
            },
        },
    }
}
