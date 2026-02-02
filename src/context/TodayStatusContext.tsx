/*
    当日状況
        Home表示（システム利用）時に当日状況を取得
        attendanceとshiftの当日分をsnapshot監視
*/
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

import { usePermittionContext } from "./PermittionContext";
import { useBusinessDateContext } from "./BuisinessDateContext";


import { getTodayStatus, TODAY_STATUS, type TodayStatus } from "../services/todayStatus";

import type { ShiftScheduleDoc } from "../types/shiftSchedule";
import type { AttendanceDoc } from "../types/attendance";

import { COLLECTIONS } from "../constants/firestore";
import { getDatabase, onValue, ref } from "firebase/database";
import { getMsUntilNextBusinessWindow } from "../utils/timeUtils";
import { SHOP_CONFIG } from "../constants/config";

interface TodayStatusContextType {
    todayStatus: TodayStatus | null;
}

const TodayStatusContext = createContext<TodayStatusContextType | undefined>(undefined);

export const TodayStatusProvider = ({ children }: { children: ReactNode }) => {
    const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(null);
    const [myShift, setMyShift] = useState<ShiftScheduleDoc | null>(null);
    const [myAttendance, setMyAttendance] = useState<AttendanceDoc | null>(null);
    const { permittion: attribute } = usePermittionContext();
    const { businessDateStr } = useBusinessDateContext();

    useEffect(() => {
        const uid = attribute?.uid || null;
        if (!uid || !businessDateStr) return;

        //  当日シフトスナップショット
        const todayShiftRef = doc(db, COLLECTIONS.SHIFT, businessDateStr, COLLECTIONS.SCHEDULE, uid);
        const unsubShitoToday = onSnapshot(todayShiftRef, (snap) => {
            setMyShift(snap.exists() ? (snap.data() as ShiftScheduleDoc) : null);
        });

        //  当日出勤情報（本人）
        const todayAttendanceRef = doc(db, COLLECTIONS.ATTENDANCE, businessDateStr, uid);
        const unsubAttendanceToday = onSnapshot(todayAttendanceRef, (snap) => {
            setMyAttendance(snap.exists() ? (snap.data() as AttendanceDoc) : null);
            // 初回実行
        });

        // クリーンアップ
        return () => {
            unsubShitoToday();
            unsubAttendanceToday();
        };
    }, [attribute?.uid, businessDateStr]);

    //  データが変わるたびにステータスを再計算
    useEffect(() => {
        const status = getTodayStatus({ schedule: myShift, attendance: myAttendance });
        setTodayStatus(status);

    }, [myShift, myAttendance]);


    useEffect(() => {
        if(todayStatus !== TODAY_STATUS.PRE_WORK) return;

        let timerStatus: ReturnType<typeof setTimeout>;
        const db = getDatabase();
        const offsetRef = ref(db, ".info/serverTimeOffset");

        // 1. サーバーとの時刻ズレ（ms）を取得
        const unsubStatusOffset = onValue(offsetRef, (snap) => {
            const offset = snap.val() || 0;

            const updateStatusTime = () => {
        // 2. 「端末の今」に「ズレ」を足して、サーバー基準の時刻を算出
                const serverNow = new Date(Date.now() + offset);
                
        // 4. 次の10:00までの待ち時間を計算（ここもサーバー時刻基準）
                const delay = getMsUntilNextBusinessWindow(serverNow, 
                    myShift?.startTime || SHOP_CONFIG.SHIFT_VIEW_START_TIME_DEFAULt);
                
        // 前のタイマーがあれば掃除して再予約（メモリに優しい）
                clearTimeout(timerStatus);
                timerStatus = setTimeout(() => {
                    const newStatus = getTodayStatus({ schedule: myShift, attendance: myAttendance });
                    setTodayStatus(newStatus);
                }, delay + 1000); // 1秒バッファを持たせる                

                console.log(`出勤時刻まであと ${Math.round(delay / 60000)} 分です。`);
            };

            updateStatusTime(); // 忘れずに初回実行
        });
        
        // クリーンアップ
        return () => {
            unsubStatusOffset();
            clearTimeout(timerStatus);
        };

    }, [ todayStatus, myShift, myAttendance ]);
    
    return (
        <TodayStatusContext.Provider value={{ todayStatus }}>
            {children}
        </TodayStatusContext.Provider>
    );
};

export const useTodayStatusContext = () => {
    const context = useContext(TodayStatusContext);
    if (context === undefined) {
        throw new Error("useTodayStatusContext must be used within a TodayScheduleProvider");
    }
    return context;
};