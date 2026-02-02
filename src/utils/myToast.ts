/**
 *  トースト用ユーティリティ
 */
import { toast } from "react-hot-toast";

import { AUTH_ERROR_MESSAGES } from "../constants/authError";
import { DISPLAY } from "../constants/japan";
import { MY_NOTICE_LEVEL, type NoticePreset } from "../types/myToast";

/**
 * toastの出力
 * 
 * @param { NoticePreset } notice - toast用の出力内容
 * @returns toast描画
 */
export const showNotice = (notice: NoticePreset) => {

    switch (notice.level) {
        case MY_NOTICE_LEVEL.SUCCESS:
            return toast.success(notice.message, notice.opts);
        case MY_NOTICE_LEVEL.ERROR:
            return toast.error(notice.message, notice.opts);
        case MY_NOTICE_LEVEL.NORMAL:
        default:
            return toast(notice.message, notice.opts);
    }
};

/**
 * 外部から入ってくる様々なエラー・文字列を MyNotice 型に正規化する
 */
export const toMyNotice = (input: unknown): NoticePreset => {
    if (typeof input === "string") return stringToMyNotice(input);

    if (input instanceof Error || (input && typeof input === "object" && "message" in input)) {
        return errorToMyNotice(input);
    }

    // 想定外の型が来た場合
    return {
        message: DISPLAY.AUTH.ERROR_UNKNOWN,
        level: MY_NOTICE_LEVEL.ERROR,
    };
};

/**
 * 文字列（自前スローのコード等）を変換
 */
const stringToMyNotice = (code: string): NoticePreset => {
    // 特定の文字列（AbortErrorなど）に対する個別判定が必要ならここに追加
    if (code === 'AbortError') {
        return {
            message: "キャンセルしました",
            level: MY_NOTICE_LEVEL.NORMAL,
        };
    }

    return {
        message: AUTH_ERROR_MESSAGES[code] || code || DISPLAY.AUTH.ERROR_UNKNOWN,
        level: MY_NOTICE_LEVEL.ERROR,
    };
};

/**
 * Errorオブジェクト（FirebaseError含む）を変換
 */
const errorToMyNotice = (error: any): NoticePreset => {
    // FirebaseError 等は code プロパティを持つ、自前Errorは message にコードを入れる運用
    const errorCode = error.code || error.name || error.message;

    if (errorCode === 'AbortError') {
        return {
            message: "キャンセルしました",
            level: MY_NOTICE_LEVEL.NORMAL,
        };
    }

    return {
        message: AUTH_ERROR_MESSAGES[errorCode] || DISPLAY.AUTH.ERROR_UNKNOWN,
        level: MY_NOTICE_LEVEL.ERROR,
    };
};
