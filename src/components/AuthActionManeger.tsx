import { useMemo, useState } from "react";

import { usePermittionContext } from "../context/PermittionContext";

import { ACCESS_USER_STATUS, ISSUE_ACCESS_USER_STATUS_CONTENT } from "../services/accessUserStatus";

import { DISPLAY } from "../constants/japan";

import MessageView from "./MessageView";
import AuthSelector from "./AuthSelector";
import IssueIdArea from "./IssueIdArea";
import { useAuthActions } from "../hooks/useAuthActions";
import UserQrCode from "./UserQrCode";
import toast from "react-hot-toast";
import { showNotice, toMyNotice } from "../utils/myToast";

interface Props {
  mode: AuthActionManegerViewMode;
}

export const AUTH_ACTION_MANEGER_VIEW_MODE = {
  ISSUE: 'issue',
}

export type AuthActionManegerViewMode = typeof AUTH_ACTION_MANEGER_VIEW_MODE[keyof typeof AUTH_ACTION_MANEGER_VIEW_MODE];

export default function AuthActionManager({ mode }: Props) {
  const [isQrOpen, setQrOpen] = useState(false); 
  const [name, setName] = useState("");
  const { permittion: attribute } = usePermittionContext();
  const {
    loading, 
    issueAnonymousId, 
    handleCopy,
    handleShare,
    canShare 
  } = useAuthActions();

  const status = attribute?.accessUserStatus || ACCESS_USER_STATUS.FIREBASE_AUTH_NONE;
  const uid = attribute?.uid || "";

  /**
   * 共通の実行基盤（ラッピング）
   */
  const runAuthAction = (action: () => Promise<void>) => async () => {
    try {
      await action();
    } catch (e: unknown) {
      console.error("useAuthAction:", e);
      //  トーストでエラー表示
      showNotice(toMyNotice(e));
    }
  };

  // mode に応じて、どのコンテンツ集団からメッセージを取るかを「選択」する
  const message = useMemo(() => {
    if (mode === AUTH_ACTION_MANEGER_VIEW_MODE.ISSUE) {
      return ISSUE_ACCESS_USER_STATUS_CONTENT[status];
    }
    return { title: "", message: "" }; 
  }, [mode, status]); // mode か status が変わった時だけ再計算

  const requestUrl = useMemo(() => {
    if (mode === AUTH_ACTION_MANEGER_VIEW_MODE.ISSUE) {
      const params = new URLSearchParams({
        uid,
        ...(name ? { name } : {}),
      });
      return `${window.location.origin}/employeesRegist?${params.toString()}`;
    }
    return "";
  }, [mode, uid, name]);

  /**
   *  IssueでのAuth認証なし（ログオフ状態）・・・外部認証 or　仮ID表示
   */
  const isIssueAuthNone = (
      ( mode === AUTH_ACTION_MANEGER_VIEW_MODE.ISSUE &&
        status === ACCESS_USER_STATUS.FIREBASE_AUTH_NONE)
  );

  /**
   *  Auth認証済（IDを管理者に連携→社員情報登録待ちの状態）・・・ID連携エリアを表示　＆　認証追加エリア
   */
  const isIssueNotRegisterd = (
      ( mode === AUTH_ACTION_MANEGER_VIEW_MODE.ISSUE &&
        status === ACCESS_USER_STATUS.NOT_REGISTERD
      )
  );

  const onShare = runAuthAction(async () => {
    if (!name.trim()) {
    }
    await handleShare(requestUrl);
  });

  const onCopy = runAuthAction(async () => {
    await handleCopy(requestUrl);
    toast.success("こぴったぴょん");
  });

  console.log('status =', status)
  

  return (
    <div style={actionContainerStyle}>
      {/* 状態別のメッセージ表示 */}
      <MessageView message={message} />

      {/** Auth認証なしの場合は外部プロバイダ登録は上に表示 */}
      {isIssueAuthNone  && (
        <AuthSelector />
      )}

      {/* 認証プロバイダを追加したら、管理者に連携するQRを出す */}
      {isIssueNotRegisterd && (
        <IssueIdArea 
          uid={uid} 
          name={name}
          setName={setName}
          canShare={canShare} 
          onShare={onShare} 
          onCopy={onCopy}
          isQrOpen={isQrOpen}
          onToggleQr={() => setQrOpen(!isQrOpen)}>
          <UserQrCode requestUrl={requestUrl} />
        </IssueIdArea>
      )}

      {/* ID連携中は外部プロバイダ追加は下に表示（追加のために表示） */}
      {isIssueNotRegisterd  && (
        <AuthSelector />
      )}

      {/* 最初のアクセス用「ID発行」を出す(Issueでしか使用しない）) */}
      {isIssueAuthNone && (
        <button onClick={runAuthAction(issueAnonymousId)} disabled={loading}>
          {DISPLAY.ISSUE.BUTTON_ISSUE_ID}
        </button>
      )}

    </div>
  );
}


/* styles */
// モダンな配色とシャドウの定数
const THEME = {
  accent: "#007AFF",       // iOS風の鮮やかなブルー
  line: "#06C755",         // LINEブランドカラー
  bg: "#F2F2F7",           // 背景色（薄いグレー）
  card: "rgba(255, 255, 255, 0.8)", // 透過カード
  text: "#1C1C1E",         // 深い墨色
  border: "rgba(0, 0, 0, 0.05)",
};

const actionContainerStyle: React.CSSProperties = {
  maxWidth: "420px",
  margin: "24px auto",
  padding: "24px",
  backgroundColor: THEME.bg,
  borderRadius: "28px",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};
