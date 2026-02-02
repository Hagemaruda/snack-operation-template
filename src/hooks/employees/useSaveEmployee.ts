/**
 *  Firestoreアクセス関数呼び出し用のhook
 *  画面からは useEmployees を使用する（当hookをラッピング）
 *  このhookはuseEmployeesからしか呼ばれない前提
 */
import { useState, useCallback } from "react";
import { saveNewEmployeeDoc } from "../../services/employees";
import type { EmployeeView } from "../../types/employee";

/**
 *  このhookはuseEmployee専用
 *  saveNewEmployeeDocはここからしか呼ばれない
 *  @see useEmployees.
 *  @deprecated
 */
export const useSaveEmployee = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);

  const saveEmployee = useCallback(
    async (viewData: EmployeeView, operatorId: string) => {
      setIsSaving(true);
      setSaveError(null);

      try {
        const result = await saveNewEmployeeDoc(viewData, operatorId);
        return { success: true, data: result };
      } catch (err) {
        const errorInstance = err instanceof Error ? err : new Error("Unknown error occurred");
        setSaveError(errorInstance);
        return { success: false, error: errorInstance };
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  return {
    saveEmployee,
    isSaving,
    saveError,
  };
};