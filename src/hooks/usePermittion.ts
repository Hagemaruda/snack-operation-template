/*
    usePermittion
      システム使用者の情報（Contextへの値設定）
        user（FirebaseAuth）
        employees（Firestore: onShanpshot）
*/
import { useEffect, useState } from "react";

import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

import { useFirebaseAuthContext } from "../context/FirebaseAuthContext";

import { ROLES } from "../constants/roles";
import { COLLECTIONS } from "../constants/firestore";

import { ACCESS_USER_NAME, ACCESS_USER_STATUS, getAccessUserStatus } from "../services/accessUserStatus";

import type { EmployeeDoc } from "../types/employee";
import { CONST_STRING } from "../constants/stringConstant";
import type { Permittion } from "../context/PermittionContext";
import type { Role } from "../constants/roles";


export function usePermittion() {
  const { user } = useFirebaseAuthContext();
  const [permittion, setPermittion] = useState<Permittion | null>(null);

  useEffect(() => {
    if (!user) {

      //  FirebaseAuthの認証前

      const status = ACCESS_USER_STATUS.FIREBASE_AUTH_NONE;

      //  attributeは初期値で設定
      const uid = "";
      const name = CONST_STRING.UNKNOWN_USER_NAME;
      const role: Role = ROLES.UNKNOWN;
      const enable = false;
      const accessUserStatus = status;

      setPermittion({
        uid,
        name,
        role,
        enable,
        accessUserStatus,
      });
      return;
    } else {

      //  FirebaseAuthの認証後
      const uid = user?.uid;

      //　社員情報を取得（Firestore）
      //    参照情報の定義（いわゆるQuery構文と作っていると思えばいい）
      //      employeesコレクション
      //        ドキュメントID = uid
      const ref = doc(db, COLLECTIONS.EMPLOYEES, uid);
      //    Firebaseドキュメント監視（変化があった場合に動く）
      const unsubEmp = onSnapshot(ref, (snap) => {

        const data = snap.data() as EmployeeDoc | undefined;

        //  Auth認証後のContext設定
        const accessUserStatus = getAccessUserStatus(user, data);
        const role = data?.role ?? ROLES.UNKNOWN;
        const name = data?.name ?? ACCESS_USER_NAME[accessUserStatus];
        const enable = data?.enable ?? false;

        setPermittion({
          uid,
          name,
          role,
          enable,
          accessUserStatus,
        });
        return;
      })
      return () => unsubEmp();
    };
  }, [user]);

  return { attribute: permittion, setPermittion };
}
