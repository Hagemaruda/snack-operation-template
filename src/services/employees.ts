import { db } from "../firebase";
import {
    doc,
    runTransaction,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { WAGE_KIND, type EmployeeView, } from "../types/employee";
import type {
    EmployeeDocWrite,
} from "../types/employee";
import { COLLECTIONS } from "../constants/firestore";

/**
 *  @description
 *          従業員新規登録：service<br>
 *          Viewデータから各Docへの変換、およびトランザクションによる原子性の保証
 *  @param  {EmployeeView} viewData - 社員情報の画面用オブジェクト
 *  @param  {string} operatorId - Firestoreの更新者として記録されるID<br>通常はuser(Context)のIDを設定
 * 
 *  @throws {Error} ALREADY_EXISTS
 *  @deprecated　直接の呼び出し禁止. hooks/useEmployees を使用.
 *  @see useSaveEmployee
 *  @see useEmployees
 */
export const saveNewEmployeeDoc = async (
    viewData: EmployeeView,
    operatorId: string
) => {
    // 1. 参照の作成（トランザクションの外でIDを確定させる）
    const empRef = doc(db, COLLECTIONS.EMPLOYEES, viewData.uid);
    const wageRef = doc(collection(db, `${COLLECTIONS.EMPLOYEES}/${viewData.uid}/${COLLECTIONS.WAGE}`));
    const historyRef = doc(collection(db, `${COLLECTIONS.HISTORY}/${COLLECTIONS.EMPLOYEES_HISTRY}`));

    return await runTransaction(db, async (transaction) => {
        // 2. 重複チェック
        const empDoc = await transaction.get(empRef);
        if (empDoc.exists()) {
            // TODO: 定数化
            throw new Error("saveNewEmployeeDoc/ALREADY_EXISTS");
        }

        // 3. 共通のサーバー時刻
        const now = serverTimestamp();

        // 4. Employee本体
        const name = viewData.name;
        const role = viewData.role;
        const enable = viewData.enable;
        const customBacks = viewData.customBacks ?? undefined;
        const createdBy = operatorId;
        const createdAt = now;
        const employeeDoc: EmployeeDocWrite = {
            name,
            role,
            enable,
            customBacks,
            createdBy,
            createdAt,
        };

        //　４. 給与情報
        const wageDoc = (() => {
            switch (viewData.wage.kind) {
                case WAGE_KIND.ACTIVE:
                return {
                    hourly: viewData.wage.hourly,
                    startDate: viewData.wage.startDate,
                    endDate: undefined,
                    createdBy,
                    createdAt,
                };

                case WAGE_KIND.CLOSED:
                return {
                    hourly: viewData.wage.hourly,
                    startDate: viewData.wage.startDate,
                    endDate: viewData.wage.endDate,
                    createdBy,
                    createdAt,
                };

                case WAGE_KIND.NONE:
                return undefined;
            }
        })();

        // 6. 履歴ドキュメント
        // 履歴生成ロジックは外部関数を呼び出す（実装は後回し）
        const historyDoc = createHistoryDoc(viewData, employeeDoc, operatorId, now);

        // 7. セット
        transaction.set(empRef, employeeDoc);
        if (wageDoc) {
            transaction.set(wageRef, wageDoc);
        }
        transaction.set(historyRef, historyDoc);

        return;
    });
};

/**
 * 履歴ドキュメント生成（詳細実装は後ほど）
 */
const createHistoryDoc = (
    view: EmployeeView,
    after: EmployeeDocWrite,
    operatorId: string,
    createdAt: any
) => {
    return {
        uid: view.uid,
        // TODO: 定数化
        memo: "新規採用登録",
        before: undefined,
        after: {
            name: after.name,
            role: after.role,
            enable: after.enable,
            customBacks: after.customBacks
        },
        createdBy: operatorId,
        createdAt: createdAt
    };
};
