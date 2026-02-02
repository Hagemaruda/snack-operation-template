/**
 *  routeConfig.tsx
 *      使用できるページを定義していると思えばいい
 *      使用できるページの定義情報はrouteDefinitions
 *      このソースに業務ページを直接追加するのはＮＧ！！
 *
 *      動きはソース内にコメント
 */
import { Navigate, Route, Routes } from "react-router-dom";

import { PROTECTED_ROUTES } from "./routeDefinitions";

import { usePermittionContext } from "../context/PermittionContext";

import { ACCESS_USER_STATUS } from "../services/accessUserStatus";

import Issue from "../pages/Issue";
import Header from "../components/Header";
import { TodayStatusProvider } from "../context/TodayStatusContext";
import { BusinessDateProvider } from "../context/BuisinessDateContext";

export const RouteConfig = () => {
  const { permittion: attribute } = usePermittionContext();

  //  1. 全体ガード
  const isAllowed = attribute?.accessUserStatus === ACCESS_USER_STATUS.PERMITTED;

  //  システム利用許可がない場合はIssueを表示
  if (!isAllowed) {
    return (
      <Routes>
        <Route path="/issue" element={<Issue />} />
        <Route path="*" element={<Navigate to="/issue" replace />} />
      </Routes>
    );
  }

  // 2. 自分のロールが許可されているルートだけを抽出
  // （ここでページ定義（routeDefinitiosを展開している）
  const accessibleRoutes = PROTECTED_ROUTES.filter((route) =>
    route.allowedRoles.includes(attribute.role)
);

  return (
    <BusinessDateProvider>    
      <TodayStatusProvider>
        {/* 全ページ共通でヘッダを表示 */}
        {attribute?.enable && <Header />}
        <Routes>
          {/* 権限があるルートのみを定義（これ以外は定義されない） */}
          {accessibleRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* ルート(/ )は/Homeへという定義 */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* デフォルト設定
              権限ないページのURL
              存在しないURL
          */}
          <Route path="*" element={<div>ページが見つかりません（404）</div>} />
        </Routes>
      </TodayStatusProvider>
    </BusinessDateProvider>
  );
};
