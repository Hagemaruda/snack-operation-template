import {
  signOut, 
  sendSignInLinkToEmail, 
  GoogleAuthProvider, 
  linkWithPopup, 
  signInWithPopup,
  isSignInWithEmailLink, 
  signInWithEmailLink,
  EmailAuthProvider, 
  linkWithCredential,
  signInAnonymously, 
} from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "../firebase";

import { addHistory, CRUD } from "./history";
import { OPERATIONS } from "../constants/operations";
import { CONST_STRING } from "../constants/stringConstant";
import { DISPLAY } from "../constants/japan";

import type { LoginMode } from "../constants/auth";

/**
 * ログオフ
 */
export const logout = async () => {
  try {
    if (window.confirm(DISPLAY.AUTH.LOGOFF_CONFIRM)) {
      await signOut(auth);
    }
  } catch (error) {
    alert(DISPLAY.AUTH.LOGOFF_FAILURE);
  }
};

// --- Google系 ---

// Google連携 (Authアカウントに紐付け)
export const linkGoogle = async (user: User, userName: string) => {
  const provider = new GoogleAuthProvider();
  await linkWithPopup(user, provider);
  
  const crud = CRUD.UPDATE;
  const operatorName = userName;
  const operation = OPERATIONS.AUTH.LINK_GOOGLE;
  const targetId = user.uid;

  //  ログ出力
  addHistory({ crud, operatorName, operation, targetId, }
  ).catch((e) => {
    console.log(e);
    alert(DISPLAY.AUTH.LOG_WRITE_FAILUER);
  });
};

// Googleログイン (別のアカウントで入り直し)
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
  // ログイン履歴が必要ならここに addHistory を追加
};

// --- メールリンク系 ---

// メール送信 (引数に mode を追加して URL を出し分け)
export const sendAuthEmail = async (email: string, mode: LoginMode) => {
  const actionCodeSettings = {
    // URLパラメータに mode を付与して、復帰時に判別できるようにする
    url: `${window.location.origin}/authLink?mode=${mode}`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem(CONST_STRING.AUTH.LINK_EMAIL, email);
};

// メールリンク完了処理 (連携)
export const completeEmailLinking = async (user: User, userName: string) => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem(CONST_STRING.AUTH.LINK_EMAIL);
    if (!email) return false;

    const cred = EmailAuthProvider.credentialWithLink(email, window.location.href);
    await linkWithCredential(user, cred);
    window.localStorage.removeItem(CONST_STRING.AUTH.LINK_EMAIL);

    //  ログ出力
    const crud = CRUD.UPDATE;
    const operatorName = userName;
    const operation = OPERATIONS.AUTH.LINK_EMAIL;
    const targetId = user.uid;
    const details = `Email: ${email}`;
    addHistory({crud,operatorName,operation,targetId,details,}
    ).catch((e) => {
      console.log(e);
      alert(DISPLAY.AUTH.LOG_WRITE_FAILUER);
    });
    return true;
  }
  return false;
};

// メールリンク完了処理 (ログイン)
export const completeEmailSignIn = async () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem(CONST_STRING.AUTH.LINK_EMAIL);
    if (!email) {
      email = window.prompt(DISPLAY.AUTH.EMAIL_REENTER) || "";
    }
    if (!email) return false;

    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem(CONST_STRING.AUTH.LINK_EMAIL);
    return !!result.user;
  }
  return false;
};

/**
 * 匿名ユーザーとして新規IDを発行し、サインインします。
 */
export const signInAsAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    return user;
  } catch (error) {
    console.error("匿名サインインに失敗しました:", error);
    throw error;
  }
};
