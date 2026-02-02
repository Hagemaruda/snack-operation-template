/**
 *  プログラムで使用される文字列定数
 */
import { DISPLAY } from "./japan";

export const CONST_STRING ={
    AUTH: {
        LINK_EMAIL:     'emailForLink',
    },
    WAGE_KIND: {
        NONE:           'none',
        ACTIVE:         'active',
        CLOSED:         'ended',
    },
    TOAST: {
        SUCCESS:        'success,',
        NORMAL:         'normal',
        ERROR:          'error',
    },
    /**
     *  店舗名未定義の場合に店舗名として表示される
     *  @see DISPLAY.SHOP_NAME_NOTHING
     */
    SHOP_NAME_NOTHING:  DISPLAY.SHOP_NAME_NOTHING,
    /**
     *  ユーザ名が確定できない時（employees未登録）で表示される
     *  @see DISPLAY.UNKNOWN_USER_NAME
     */
    UNKNOWN_USER_NAME:  DISPLAY.UNKNOWN_USER_NAME,
} as const;

export const NL: string = '\n';
