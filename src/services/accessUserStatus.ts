/**
 *  使用ユーザ（アクセスユーザ）のシステム利用認証に関連するサービス
 */
import type { User } from "firebase/auth";
import type { EmployeeDoc } from "../types/employee";
import { LABEL, MESSAGE } from "../constants/japan";
import type { Role } from "firebase/ai";
import { ROLES } from "../constants/roles";

/**
 *  状態定義
 *  ①Firebaseの認証状態：認証なし、仮認証（匿名認証）、認証OK
 *  ②社員情報（Firestore/employees）の状態
 *    ①②の状態を複合的に判断して状態が決まる
 *  @see getAccessUserStatus
 */
export const ACCESS_USER_STATUS = {
  /**
   *  Firebase認証なし
   */
  FIREBASE_AUTH_NONE: 'firebaseAuthNone',
  /**
   *  Firebaseに外部民商が未登録（仮認証）
   *  匿名認証状態
   */
  FIREBASE_NO_PROVIDER: 'firebaseNoProvider',
  /**
   *  Firease認証完了
   *  社員情報が未登録
   */
  NOT_REGISTERD: 'notRegisterd',
  /**
   *  Firease認証完了
   *  社員情報のシステム利用可否＝システム利用不可
   */
  DISABLED: 'disabled',
  /**
   *  Firebase認証完了
   *  社員情報のシステム利用可否＝システム利用可能
   */
  PERMITTED: 'permitted',
} as const;

export type AccessUserStatus = typeof ACCESS_USER_STATUS[keyof typeof ACCESS_USER_STATUS];


export const ACCRSS_USER_STATUS_LABEL = {
  [ACCESS_USER_STATUS.FIREBASE_AUTH_NONE]:    LABEL.USER_STATUS.FIREBASE_ATUH_NONE,
  [ACCESS_USER_STATUS.FIREBASE_NO_PROVIDER]:  LABEL.USER_STATUS.FIREbASE_NO_PROVIDER,
  [ACCESS_USER_STATUS.NOT_REGISTERD]:         LABEL.USER_STATUS.NOT_REGISTERD,
  [ACCESS_USER_STATUS.DISABLED]:              LABEL.USER_STATUS.DISABLED,
  [ACCESS_USER_STATUS.PERMITTED]:             LABEL.USER_STATUS.PERMITTED,
} as const;


export const ACCESS_USER_NAME = {
  [ACCESS_USER_STATUS.FIREBASE_AUTH_NONE]:    LABEL.USER_STATUS_NAME.FIREBASE_ATUH_NONE,
  [ACCESS_USER_STATUS.FIREBASE_NO_PROVIDER]:  LABEL.USER_STATUS_NAME.FIREbASE_NO_PROVIDER,
  [ACCESS_USER_STATUS.NOT_REGISTERD]:         LABEL.USER_STATUS_NAME.NOT_REGISTERD,
  [ACCESS_USER_STATUS.DISABLED]:              LABEL.USER_STATUS_NAME.DISABLED,
  [ACCESS_USER_STATUS.PERMITTED]:             LABEL.USER_STATUS_NAME.PERMITTED,
} as const;

/**
 *  Issue（ユーザがシステム利用開始の手続きをする画面）用の状況別メッセージ
 */
export const ISSUE_ACCESS_USER_STATUS_CONTENT = {
  [ACCESS_USER_STATUS.FIREBASE_AUTH_NONE]: {
    title:    MESSAGE.ISSUE.STSTUS_FIREBASE_AUTH_NONE.title,
    message:  MESSAGE.ISSUE.STSTUS_FIREBASE_AUTH_NONE.message,
  },
  [ACCESS_USER_STATUS.NOT_REGISTERD]: {
   title:    MESSAGE.ISSUE.STSTUS_NOT_REGISTERD.title,
   message:  MESSAGE.ISSUE.STSTUS_NOT_REGISTERD.message,
  },
  [ACCESS_USER_STATUS.FIREBASE_NO_PROVIDER]: {
    title:    MESSAGE.ISSUE.STSTUS_FIREBASE_NO_PROVIDER.title,
    message:  MESSAGE.ISSUE.STSTUS_FIREBASE_NO_PROVIDER.message,
  },
  [ACCESS_USER_STATUS.DISABLED]: {
    title:    MESSAGE.ISSUE.STSTUS_DISABLED.title,
    message:  MESSAGE.ISSUE.STSTUS_DISABLED.message,
  },
  [ACCESS_USER_STATUS.PERMITTED]: {     //  issue画面に行かないので必要ない
    title: '',
    message: '',
  },
} as const;

/**
 *  使用者の状況取得
 *  @param {User | null} user - FirebaseAuthのuser（取得前ならnull）
 *  @param {EmployeeDoc | undefined} employeeDoc - Firestoreの該当社員情報
 *  @returns {AccessUserStatus}
 */
export const getAccessUserStatus = (( user: User | null, employeeDoc?: EmployeeDoc | undefined): AccessUserStatus => {
  //  1.  FirebaseAuth未認証
  if (!user) return ACCESS_USER_STATUS.FIREBASE_AUTH_NONE;
  //  2.　FirebaseAuthの認証（プロバイダ）未登録
  if (user.isAnonymous) return ACCESS_USER_STATUS.FIREBASE_NO_PROVIDER;
  //  FirebaseAuth認証済
  //  3.  employeesにIDがない
  if (!employeeDoc) return ACCESS_USER_STATUS.NOT_REGISTERD;
  //  4.　employeesの利用権限がない（anable = false）
  if (!employeeDoc.enable) return ACCESS_USER_STATUS.DISABLED;
  //  5.  利用資格あり
  return ACCESS_USER_STATUS.PERMITTED;
});

export const isAdmin = ((role: Role): boolean =>{
  return (role.toString() === ROLES.ADMIN);
});