import { useState } from "react";
import type { EmployeeView } from "../types/employee";

/**
 * 画面の「入力状態」だけを管理するフック
 * 登録画面でも、後の編集画面でも共通で使える
 */
export const useEmployeeEdit = (initialData: EmployeeView) => {
  const [formData, setFormData] = useState<EmployeeView>(initialData);

  // 汎用的な更新関数（名前や権限が変わった時に呼ぶ）
  const updateField = <K extends keyof EmployeeView>(
    key: K, 
    value: EmployeeView[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return { formData, updateField, setFormData };
};