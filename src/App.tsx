import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { auth, db } from "./firebase";
import { EmployeeContext } from "./context/EmployeeContext";
import type { Employee } from "./types/Employee";

import Issue from "./pages/Issue";
import Home from "./pages/Home";
import EmployeesRegist from "./pages/EmployeesRegist";
import AuthLink from "./pages/AuthLink";

import RequireRole from "./components/RequireRole";

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [empLoading, setEmpLoading] = useState(true);

  // 🔹 Auth監視
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // 🔹 employee取得（Auth済みのみ）
  useEffect(() => {
    if (!authReady) return;

    if (!uid) {
      setEmployee(null);
      setEmpLoading(false);
      return;
    }

    setEmpLoading(true);
    const ref = doc(db, "employees", uid);
    getDoc(ref)
      .then((snap) => {
        setEmployee(snap.exists() ? (snap.data() as Employee) : null);
      })
      .catch((e) => {
        console.error("employee取得エラー:", e);
        setEmployee(null);
      })
      .finally(() => setEmpLoading(false));
  }, [uid, authReady]);

  // 🔹 Auth / Employeeロード中はLoading
  if (!authReady || empLoading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  // Firebase Auth認証
  const isLoggedIn = !!uid; 

  return (
    <EmployeeContext.Provider value={{ employee }}>
      <Routes>
        {/* 誰でもアクセス可能 */}
        <Route
          path="/issue"
          element={<Issue />}
        />

        {/* 通常利用画面 */}
        <Route
          path="/home"
          element={
            <RequireRole allowedRoles={["admin", "staff", "cast"]}>
              <Home />
            </RequireRole>
          }
        />

        {/* 認証情報追加 */}
        <Route
          path="/authLink"
          element={
            <RequireRole allowedRoles={["admin", "staff", "cast"]}>
              <AuthLink />
            </RequireRole>
          }
        />

        {/* 管理者専用 */}
        <Route
          path="/employeesRegist"
          element={
            <RequireRole allowedRoles={["admin", "staff"]}>
              <EmployeesRegist />
            </RequireRole>
          }
        />

        {/* 存在しないパスはリダイレクト */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/home" : "/issue"} replace />}
        />
      </Routes>
    </EmployeeContext.Provider>
  );
}
