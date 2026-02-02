/*
    当日ステータス
*/

import { LABEL } from "../constants/japan";
import { getMinutesFromBusinessStart } from "../utils/timeUtils";

export const TODAY_STATUS = {
    WORKING: 'working',
    WORK_IN: 'workIn',
    WORK_FINISH: 'workFinish',
    REST: 'rest',
    PRE_WORK: 'preWork',
    LATENESS: 'lateness',
    CANCELED: 'canceled',
    //  以降、このシステムでは未使用
    WORK_REST: 'workRest',
} as const;

export type TodayStatus = typeof TODAY_STATUS[keyof typeof TODAY_STATUS];

// 役割の表示名も追加して揃える！
export const TODAY_STATUS_LABELS = {
    [TODAY_STATUS.WORKING]: LABEL.TODAY_STATUS.WORKING,
    [TODAY_STATUS.WORK_IN]: LABEL.TODAY_STATUS.WORK_IN,
    [TODAY_STATUS.WORK_FINISH]: LABEL.TODAY_STATUS.WORK_FINISH,
    [TODAY_STATUS.REST]: LABEL.TODAY_STATUS.REST,
    [TODAY_STATUS.PRE_WORK]: LABEL.TODAY_STATUS.PRE_WORK,
    [TODAY_STATUS.LATENESS]: LABEL.TODAY_STATUS.LATENESS,
    [TODAY_STATUS.CANCELED]: LABEL.TODAY_STATUS.CANCELED,
    [TODAY_STATUS.WORK_REST]: LABEL.TODAY_STATUS.WORK_REST,
} as const;

// 配色
export const TODAY_STATUS_COLOR = {
    [TODAY_STATUS.WORKING]: { bg: "#e6fffa", text: "#2c7a7b" },
    [TODAY_STATUS.WORK_IN]: { bg: "#fffaf0", text: "#9c4221" },
    [TODAY_STATUS.WORK_FINISH]: { bg: "#edf2f7", text: "#4a5568" },
    [TODAY_STATUS.REST]: { bg: "#ffffff", text: "#cbd5e0" },
    [TODAY_STATUS.PRE_WORK]: { bg: "#ebf8ff", text: "#2b6cb0" },
    [TODAY_STATUS.LATENESS]: { bg: "#fff5f5", text: "#c53030" },
    [TODAY_STATUS.CANCELED]: { bg: "#f7fafc", text: "#a0aec0" },
    [TODAY_STATUS.WORK_REST]: { bg: "#f7fafc", text: "#a0aec0" },  // 未使用 
} as const;

/**
 * 取得したデータから現在のステータスを判定する
 */
export const getTodayStatus = (data: { schedule: any, attendance: any }): TodayStatus => {
    const { schedule, attendance } = data;

    // ① 実績(Attendance)優先判定
    if (attendance && !attendance.isCanceled) {
        if (attendance.endTime) return TODAY_STATUS.WORK_FINISH;
        if (attendance.startTime) return TODAY_STATUS.WORKING;
        if (attendance.requestTime) return TODAY_STATUS.WORK_IN;
    }

    // ② 予定(Schedule)判定
    if (schedule) {
        if (schedule.isCanceled) return TODAY_STATUS.CANCELED;

        // 現在時刻を "HH:mm" 形式で取得
        const now = new Date();
        const nowTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // 10:00起点での経過分数に変換して比較
        const nowMinutes = getMinutesFromBusinessStart(nowTimeStr);
        const startMinutes = getMinutesFromBusinessStart(schedule.startTime);

        // 数値の大小だけで「遅刻（予定より今が後）」を判定
        if (nowMinutes > startMinutes) {
            return TODAY_STATUS.LATENESS;
        }
        return TODAY_STATUS.PRE_WORK;
    }

    // ③ 何もなければ休み
    return TODAY_STATUS.REST;
};