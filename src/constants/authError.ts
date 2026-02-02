// constants/authErrors.ts
/**
 *  認証エラーチェック用の定数
 *  認証時のエラーハントリングで使用
 */
import { AuthErrorCodes } from "firebase/auth";
import { DISPLAY } from "./japan";
import { MY_NOTICE_LEVEL, type NoticePreset } from "../types/myToast";

/**
 *  チェックしているエラーと出力メッセージ
 *  catchした内容（code）に応じたメッセージの定義
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AuthErrorCodes.INVALID_EMAIL]:               DISPLAY.AUTH.ERROR_INVALID_EMAIL,
  [AuthErrorCodes.NETWORK_REQUEST_FAILED]:      DISPLAY.AUTH.ERROR_NETWORK_REQUEST_FAILED,
  [AuthErrorCodes.USER_CANCELLED]:              DISPLAY.AUTH.ERROR_USER_CANCELLED,
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: DISPLAY.AUTH.ERROR_TOO_MANY_ATTEMPTS_TRY_LATER,
  //　ユーザがログインのポップアップウィンドウを閉じた
  [AuthErrorCodes.POPUP_CLOSED_BY_USER]:        DISPLAY.AUTH.ERROR_POPUP_CLOSED_BY_USER,
  //  提供された認証情報が無効
  [AuthErrorCodes.INVALID_APP_CREDENTIAL]: "",
  //　タイムアウト
  [AuthErrorCodes.TIMEOUT]: "",


  // バリデーションエラー（自前）
  "VALIDATION_EMAIL_REQUIRED": DISPLAY.AUTH.ERROR_EMAIL_EMPTY,
  "UNKNOWN": DISPLAY.AUTH.ERROR_UNKNOWN,
};

/**
 *  エラーと出力メッセージのマップ
 *  catchした内容（code）に応じたメッセージ（toast用）の定義
 *    message: 出力メッセージ
 *    level: エラーレベル
 *    opts: トーストのオプション
 *    @see  ToastOptions
 */
export const AUTH_ERROR_NOTICE: Record<string, NoticePreset>={
  /**
   *  メール形式不正
   */
  [AuthErrorCodes.INVALID_EMAIL]:
      {
        message:    DISPLAY.AUTH.ERROR_INVALID_EMAIL,
        level:      MY_NOTICE_LEVEL.NORMAL,
        opts: {
          style: {
            background: 'red',
            color: 'white',
          },
        },
      },

  }
  