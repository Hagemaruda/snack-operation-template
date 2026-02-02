/**
 *  FirebaseAuthの定数
 */
import { LABEL, DISPLAY } from "./japan";

export const LOGIN_MODE = {
  LINK: 'link',
  SIGNIN: 'signin',
} as const;

export type LoginMode = typeof LOGIN_MODE[keyof typeof LOGIN_MODE];

export const LOGIN_TYPE_LABELS = {
  [LOGIN_MODE.LINK]:        LABEL.AUTH.LOGIN_TYPE_LINK,
  [LOGIN_MODE.SIGNIN]:      LABEL.AUTH.LOGIN_TYPE_SIGNIN,
} as const;

export const LOGIN_TYPE_COMPLETE_MESSAGE = {
    [LOGIN_MODE.LINK]:      DISPLAY.AUTH.LINK_COMPLETE,
    [LOGIN_MODE.SIGNIN]:    DISPLAY.AUTH.LOGIN_COMPLETE,
} as const;
