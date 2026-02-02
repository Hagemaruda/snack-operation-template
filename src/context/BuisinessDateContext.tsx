/*
    営業日（日付の文字）
        起動時にサーバ時刻から営業日（文字列）を作る
        日付の切り替わり時刻が来たら切り替わる
        （タイマー出して寝てるだけ）
*/
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { getDatabase, ref, onValue } from "firebase/database";

import { getBusinessDateDashStr, getBusinessDateStr, getMsUntilNextBusinessWindow } from "../utils/timeUtils";

interface BusinessDateContextType {
    businessDateStr: string | null;
    businessDateDashStr: string | null;
}

const BusinessDateContext = createContext<BusinessDateContextType | undefined>(undefined);

export const BusinessDateProvider = ({ children }: { children: ReactNode }) => {
    const [businessDateStr, setBusinessDateStr] = useState<string | null>(null);
    const [businessDateDashStr, setBusinessDateDashStr] = useState<string | null>(null);

    useEffect(() => {
        let timerId: ReturnType<typeof setTimeout>;
        const db = getDatabase();
        const offsetRef = ref(db, ".info/serverTimeOffset");

        // 1. サーバーとの時刻ズレ（ms）を取得
        const unsubOffset = onValue(offsetRef, (snap) => {
            const offset = snap.val() || 0;

            const updateBusinessDate = () => {
        // 2. 「端末の今」に「ズレ」を足して、サーバー基準の時刻を算出
                const serverNow = new Date(Date.now() + offset);
                
        // 3. サーバー時刻を元に営業日を計算してState更新
                setBusinessDateStr(getBusinessDateStr(serverNow));
                setBusinessDateDashStr(getBusinessDateDashStr(serverNow));

        // 4. 次の日付切り替えまでの待ち時間を計算（ここもサーバー時刻基準）
                const delay = getMsUntilNextBusinessWindow(serverNow);
                
        // 前のタイマーがあれば掃除して再予約（メモリに優しい）
                clearTimeout(timerId);
                timerId = setTimeout(updateBusinessDate, delay);
                
                console.log(`営業日更新完了。次回の更新まであと ${Math.round(delay / 60000)} 分`);
            };

            // 初回実行
            updateBusinessDate();
        });

        // クリーンアップ
        return () => {
            unsubOffset();
            clearTimeout(timerId);
        };
    }, []);

    return (
        <BusinessDateContext.Provider value={{ businessDateStr, businessDateDashStr }}>
            {children}
        </BusinessDateContext.Provider>
    );
};

export const useBusinessDateContext = () => {
    const context = useContext(BusinessDateContext);
    if (context === undefined) {
        throw new Error("useBusinessDateContext must be used within a BusinessDateProvider");
    }
    return context;
};