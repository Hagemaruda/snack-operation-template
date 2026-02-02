import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { ROLES } from '../constants/roles';
import { ATTENDANCE_STATUS, ATTENDANCE_ACTION } from '../services/attendance';

export const useDailyAttendance = (userRole: string | undefined, currentUid: string | undefined) => {

console.log("!!! EMERGENCY LOG !!! Hook called with:", { userRole, currentUid });
    
    const [items, setItems] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- STEP 1: 入力値の確認 ---
    console.log("STEP 1: Hook Initialized", { userRole, currentUid });

    if (!currentUid || !userRole) {
      console.log("STEP 1.1: Exit - Missing input", { currentUid, userRole });
      return;
    }

    // --- STEP 2: 日付の生成 (絶対ハイフンを入れない) ---
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const dateNoHyphen = `${y}${m}${d}`;     // 20260115
    const dateWithHyphen = `${y}-${m}-${d}`; // 2026-01-15 (Shift検索用)

    console.log("STEP 2: Date Formats", { path: dateNoHyphen, query: dateWithHyphen });

    const attendanceRef = collection(db, "attendance", dateNoHyphen, "members");
    const shiftsRef = collection(db, "shifts");
    // shift側のDBがハイフンありか無しか不明なため、確実に両方で考慮できるように一旦queryを用意
    const qShift = query(shiftsRef, where("date", "==", dateWithHyphen));

    console.log("STEP 3: Listening to Firestore path:", attendanceRef.path);

    const unsubscribe = onSnapshot(attendanceRef, async (attSnapshot) => {
      // --- STEP 4: 打刻データの受信 ---
      console.log("STEP 4: Snapshot Received", { docCount: attSnapshot.size });
      
      try {
        const shiftSnapshot = await getDocs(qShift).catch(e => {
          console.error("Shift Fetch Error:", e);
          return { docs: [] };
        });
        
        const shiftMap = shiftSnapshot.docs.reduce((acc, doc) => ({ ...acc, [doc.data().uid]: doc.data() }), {} as any);
        const attMap = attSnapshot.docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.data() }), {} as any);

        const allUids = Array.from(new Set([...Object.keys(shiftMap), ...Object.keys(attMap)]));
        const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const constructedMembers = allUids.map(uid => {
          const shift = shiftMap[uid];
          const attendance = attMap[uid];
          const status = attendance?.state || (shift && shift.startTime < currentTimeStr ? 'LATE' : 'UPCOMING');
          const isOwn = currentUid === uid;
          
          const actions: string[] = [];
          // アクション判定
          if (status === 'UPCOMING' || status === 'LATE' || status === ATTENDANCE_STATUS.REQUEST_CANCEL) {
            if (userRole === ROLES.CAST && isOwn) actions.push(ATTENDANCE_ACTION.ENTRY_REQUEST);
            if (userRole === ROLES.STAFF) actions.push(ATTENDANCE_ACTION.ENTRY_PRE_APPROVE);
            if (userRole === ROLES.ADMIN) actions.push(ATTENDANCE_ACTION.ENTRY_APPROVE);
          } else if (status === ATTENDANCE_STATUS.WORK_IN) {
            if (userRole === ROLES.CAST && isOwn) actions.push(ATTENDANCE_ACTION.CANCEL, ATTENDANCE_ACTION.RE_APPLY);
            if (userRole === ROLES.STAFF) actions.push(ATTENDANCE_ACTION.ENTRY_PRE_APPROVE, ATTENDANCE_ACTION.CANCEL);
            if (userRole === ROLES.ADMIN) actions.push(ATTENDANCE_ACTION.ENTRY_APPROVE, ATTENDANCE_ACTION.CANCEL);
          } else if (status === ATTENDANCE_STATUS.PRE_APPROVAL || status === ATTENDANCE_STATUS.APPROVAL) {
            if (userRole === ROLES.STAFF || userRole === ROLES.ADMIN) actions.push(ATTENDANCE_ACTION.LEAVE);
            if (userRole === ROLES.ADMIN && status === ATTENDANCE_STATUS.PRE_APPROVAL) actions.push(ATTENDANCE_ACTION.ENTRY_APPROVE);
          }

          return {
            id: uid, uid,
            name: attendance?.name || shift?.name || "不明",
            planStart: shift?.startTime || "--:--",
            planEnd: shift?.endTime || "--:--",
            isExtra: !shift,
            status,
            checkIn: attendance?.checkIn || null,
            actions
          };
        });

        // --- STEP 5: 表示判定 ---
        const isAdminOrStaff = userRole === ROLES.ADMIN || userRole === ROLES.STAFF;
        const hasMyData = !!shiftMap[currentUid] || !!attMap[currentUid];
        const isVisibleResult = constructedMembers.length > 0 && (isAdminOrStaff || hasMyData);

        console.log("STEP 5: Final Visibility Logic", {
          isAdminOrStaff,
          hasMyData,
          totalItems: constructedMembers.length,
          isVisibleResult
        });

        setItems(constructedMembers.sort((a, b) => a.planStart.localeCompare(b.planStart)));
        setIsVisible(isVisibleResult);
        setLoading(false);

      } catch (error) {
        console.error("CRITICAL ERROR in Snapshot Loop:", error);
      }
    });

    return () => unsubscribe();
  }, [userRole, currentUid]);

  return { items, isVisible, loading };
};