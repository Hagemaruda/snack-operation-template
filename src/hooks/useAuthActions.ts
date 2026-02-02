import { useState } from "react";

import { AuthErrorCodes } from "firebase/auth";

import { useFirebaseAuthContext } from "../context/FirebaseAuthContext";
import { usePermittionContext } from "../context/PermittionContext";

import * as AuthUtils from "../services/authActions";

import { DISPLAY } from "../constants/japan";
import { CONST_STRING } from "../constants/stringConstant";
import { ACCESS_USER_STATUS } from "../services/accessUserStatus";
import { LOGIN_MODE } from "../constants/auth";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useFirebaseAuthContext();
  const { permittion: attribute } = usePermittionContext();
  const status = attribute?.accessUserStatus;

  const canShare = (typeof navigator !== "undefined" && !!navigator.share);

  const shouldLink = 
    status === ACCESS_USER_STATUS.FIREBASE_NO_PROVIDER || 
    status === ACCESS_USER_STATUS.NOT_REGISTERD;

  // --- Google系（統合版） ---
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      if (shouldLink && user) {
        try {
          // 1. まずはリンク（ID維持）を試みる
          const name = attribute?.name ?? CONST_STRING.UNKNOWN_USER_NAME;
          await AuthUtils.linkGoogle(user, name);
        } catch (error: any) {
          // 2. 「既に他で使われている」エラーなら、そのアカウントへの「復帰」に切り替え
          if (error.code === AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
            await AuthUtils.signInWithGoogle();
          } else {
            throw error;
          }
        }
      } else {
        // 未認証なら普通にログイン
        await AuthUtils.signInWithGoogle();
      }
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // --- メール系（送信） ---
  const requestEmailAuth = async (email: string) => {
    setLoading(true);
    try {
      console.log('email:', email);
      if (email || email.trim() === "") {
        throw new Error(DISPLAY.AUTH.ERROR_EMAIL_EMPTY);
      }
      // shouldLink の状態を mode として渡し、遷移先で Link か SignIn か判断させる
      const mode = shouldLink ? LOGIN_MODE.LINK : LOGIN_MODE.SIGNIN;
      await AuthUtils.sendAuthEmail(email, mode);
      alert(DISPLAY.AUTH.MAIL_SEND_COMPLETE);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // --- メール系（完了処理） ---
  const finishEmailAuth = async () => {
    setLoading(true);
    try {
      if (shouldLink && user) {
        const name = attribute?.name ?? CONST_STRING.UNKNOWN_USER_NAME;
        return await AuthUtils.completeEmailLinking(user, name);
      } else {
        return await AuthUtils.completeEmailSignIn();
      }
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // --- 匿名認証（仮ID発行） ---
  const issueAnonymousId = async () => {
    setLoading(true);
    try {
      await AuthUtils.signInAsAnonymous();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };


  // IDコピー
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      throw e;
    }
  };

  // IDシェア
  const handleShare = async (text: string) => {
    try {
      if (!navigator.share) return;
      await navigator.share({ text: text });
    } catch (e) {
      throw e;
    }
  };

  return { 
    handleGoogleAuth,
    requestEmailAuth, 
    finishEmailAuth, 
    issueAnonymousId,
    handleCopy,
    handleShare,
    canShare,
    loading,
  };

};