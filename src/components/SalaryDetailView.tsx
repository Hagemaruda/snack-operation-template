import type { Salary } from "../types/salary";

interface SalaryDetailViewProps {
  /** 各種データ（表示の有無判定に使用） */
  salary?: Salary;
}

export const SalaryDetailView: React.FC<SalaryDetailViewProps> = ({
    salary,
}) => {
    return( <div>給与明細表示用</div> )
};
