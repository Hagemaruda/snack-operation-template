import { useSaveEmployee } from "./employees/useSaveEmployee";

/**
 *  Employeesコレクションに関する操作を統合する窓口フック
 *      1. 追加について
 *          comst { viewStateName, isStatename } = accessHookName();
 */
export const useEmployees = () => {
  // 単機能フックを呼び出す
  const { saveEmployee, isSaving, saveError } = useSaveEmployee();

  // 今後、以下のように追加していく
  // const { updateEmployee, isUpdating } = useUpdateEmployee();

  return {
    // 1. 保存（登録）
    saveEmployee,
    
    // 2. 状態（Loading/Error）
    // 複数の処理がある場合、ここで「どれかが通信中ならtrue」という統合Loadingを作ることも可能
    isSaving,
    saveError,

    // 全体的な通信状態が必要なら
    isLoading: isSaving // || isUpdating 等
  };
};