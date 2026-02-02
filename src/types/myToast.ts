import type { ToastOptions } from "react-hot-toast";
import { CONST_STRING } from "../constants/stringConstant";

/**
 *  トースト表示用の型
 */
export interface NoticePreset {
    message: string;
    level: MyNoticeLevel;
    opts?: ToastOptions;
}

export const MY_NOTICE_LEVEL = {
    SUCCESS:    CONST_STRING.TOAST.SUCCESS,
    NORMAL:     CONST_STRING.TOAST.NORMAL,
    ERROR:      CONST_STRING.TOAST.ERROR,
} as const;

/**
 *  エラーレベル
 *  等アプリ用のレベルであって標準的な考えのレベルとは一致しない
 */
export type MyNoticeLevel = typeof MY_NOTICE_LEVEL[keyof typeof MY_NOTICE_LEVEL];

