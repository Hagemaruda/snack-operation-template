/*
  出勤状況に関する処理
*/
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getBusinessDateStr } from "../utils/timeUtils";
import { useFirebaseAuthContext } from "../context/FirebaseAuthContext";
import { usePermittionContext } from "../context/PermittionContext";

export function useAttendance() {
  const { user } = useFirebaseAuthContext();
  const { attendance } = usePermittionContext();

  const [loading, setLoading] = useState(true);

  const businessDateStr = getBusinessDateStr(new Date());

  useEffect(() => {

    const businessDateStr = getBusinessDateStr(new Date());
    const attRef = doc(db, "attendance", businessDateStr, "members", user.uid;

  }, []);

  return { attendanceState, loading };
}