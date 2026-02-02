/**
 *  App.tsx
 *  <FirebaseAuthProvider>
 *    FirebaseAuth認証のContext
 *    @see  /src/context/FirebaseAuthContext.tsx
 *  <PermittionProvider>
 *    使用ユーザ（主に状態）に関するContext
 *    @see  /src/context/PermittionContext.tsx
 *  <Toaster />
 *    トースター： react-hot-toast
 *  <RouteConfig />
 *    ルート定義
 *    @see  /src/routes/RouteConfig.tsx
 */
import { Toaster } from "react-hot-toast";
import { FirebaseAuthProvider } from "./context/FirebaseAuthContext";
import { PermittionProvider } from "./context/PermittionContext";

import { RouteConfig } from "./routes/RouteConfig";

export default function App() {
  return (
    <FirebaseAuthProvider>
      <PermittionProvider>
        <Toaster />
        <RouteConfig />
      </PermittionProvider>
    </FirebaseAuthProvider>
  );
}
